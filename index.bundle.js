/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var cowsay = __webpack_require__(1);
	var fortune = __webpack_require__(7)

	var content = document.getElementById('content');

	content.innerHTML = cowsay.say({
	    text : fortune.fortune() || "pas de fortune pour l'instttannt",
	}, 1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var baloon = __webpack_require__(2);
	var cows = __webpack_require__(3);
	var faces = __webpack_require__(6);

	exports.say = function (options) {
		return doIt(options, true);
	};

	exports.think = function (options) {
		return doIt(options, false);
	};

	exports.list = cows.list;

	function doIt (options, sayAloud) {
		var cow = cows.get(options.f || "default");
		var face = faces(options);
		face.thoughts = sayAloud ? "\\" : "o";

		var action = sayAloud ? "say" : "think";
		return baloon[action](options.text || options._.join(" "), options.n ? null : options.W) + "\n" + cow(face);
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	exports.say = function (text, wrap) {
		delimiters = {
			first : ["/", "\\"],
			middle : ["|", "|"],
			last : ["\\", "/"],
			only : ["<", ">"]
		};

		return format(text, wrap, delimiters);
	}

	exports.think = function (text, wrap) {
		delimiters = {
			first : ["(", ")"],
			middle : ["(", ")"],
			last : ["(", ")"],
			only : ["(", ")"]
		};

		return format(text, wrap, delimiters);
	}

	function format (text, wrap, delimiters) {
		var lines = split(text, wrap);
		var maxLength = max(lines);

		var balloon;
		if (lines.length === 1) {
			balloon = [
				" " + top(maxLength), 
				delimiters.only[0] + " " + lines[0] + " " + delimiters.only[1],
				" " + bottom(maxLength)
			];
		} else {
			balloon = [" " + top(maxLength)];

			for (var i = 0, len = lines.length; i < len; i += 1) {
				var delimiter;

				if (i === 0) {
					delimiter = delimiters.first;
				} else if (i === len - 1) {
					delimiter = delimiters.last;
				} else {
					delimiter = delimiters.middle;
				}

				balloon.push(delimiter[0] + " " + pad(lines[i], maxLength) + " " + delimiter[1]);
			}

			balloon.push(" " + bottom(maxLength));
		}

		return balloon.join("\n"); //os.EOL
	}

	function split (text, wrap) {
		text = text.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '').replace(/\t/g, '        ');

		var lines = [];
		if (!wrap) {
			lines = text.split("\n");
		} else {
			var start = 0;
			while (start < text.length) {
				var nextNewLine = text.indexOf("\n", start);

				var wrapAt = Math.min(start + wrap, nextNewLine === -1 ? text.length : nextNewLine);

				lines.push(text.substring(start, wrapAt));
				start = wrapAt;

				// Ignore next new line
				if (text.charAt(start) === "\n") {
					start += 1;
				}
			}
		}

		return lines;
	}

	function max (lines) {
		var max = 0;
		for (var i = 0, len = lines.length; i < len; i += 1) {
			if (lines[i].length > max) {
				max = lines[i].length;
			}
		}

		return max;
	}

	function pad (text, length) {
		return text + (new Array(length - text.length + 1)).join(" ");
	}

	function top (length) {
		return new Array(length + 3).join("_");
	}

	function bottom (length) {
		return new Array(length + 3).join("-");
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var replacer = __webpack_require__(4);
	var cows = {
		default: __webpack_require__(5),
	};

	exports.get = function (cow) {
		var text = cows[cow];

		return function (options) {
			return replacer(text, options);
		};
	}

	exports.list = function (callback) {
		callback(null, cows.keys());
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function (cow, variables) {
		var eyes = escapeRe(variables.eyes);
		var tongue = escapeRe(variables.tongue);

		if (cow.indexOf("$the_cow") !== -1) {
			cow = extractTheCow(cow);
		}

		return cow
			.replace(/\$thoughts/g, variables.thoughts)
			.replace(/\$eyes/g, eyes)
			.replace(/\$tongue/g, tongue)
			.replace(/\$\{eyes\}/g, eyes)
			.replace(/\$\{tongue\}/g, tongue)
		;
	};

	/*
	 * "$" dollar signs must be doubled before being used in a regex replace
	 * This can occur in eyes or tongue.
	 * For example:
	 *
	 * cowsay -g Moo!
	 *
	 * cowsay -e "\$\$" Moo!
	 */
	function escapeRe (s) {
		if (s && s.replace) {
			return s.replace(/\$/g, "$$$$");
		}
		return s;
	}

	function extractTheCow (cow) {
		cow = cow.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '');
		var match = /\$the_cow\s*=\s*<<"*EOC"*;*\n([\s\S]+)\nEOC\n/.exec(cow);

		if (!match) {
			console.error("Cannot parse cow file\n", cow);
			return cow;
		} else {
			return match[1].replace(/\\{2}/g, "\\").replace(/\\@/g, "@").replace(/\\\$/g, "$");
		}
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "$the_cow = <<\"EOC\";\n        $thoughts   ^__^\n         $thoughts  ($eyes)\\\\_______\n            (__)\\\\       )\\\\/\\\\\n             $tongue ||----w |\n                ||     ||\nEOC\n"

/***/ },
/* 6 */
/***/ function(module, exports) {

	var modes = {
		"b" : {
			eyes : "==",
			tongue : "  "
		},
		"d" : {
			eyes : "xx",
			tongue : "U "
		},
		"g" : {
			eyes : "$$",
			tongue : "  "
		},
		"p" : {
			eyes : "@@",
			tongue : "  "
		},
		"s" : {
			eyes : "**",
			tongue : "U "
		},
		"t" : {
			eyes : "--",
			tongue : "  "
		},
		"w" : {
			eyes : "OO",
			tongue : "  "
		},
		"y" : {
			eyes : "..",
			tongue : "  "
		}
	};

	module.exports = function (options) {
		for (var mode in modes) {
			if (options[mode] === true) {
				return modes[mode];
			}
		}

		return {
			eyes : options.e || "oo",
			tongue : options.T || "  "
		};
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var fortunes = __webpack_require__(8).default;

	(function(){
	    var fortune = {};

	    fortune.fortune = function(){
	        var r = Math.floor(Math.random() * fortunes.length);
	        return fortunes[r];
	    };

	    module.exports = fortune;
	})();


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	exports.default = __webpack_require__(9).split('%');

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "A blind rabbit was hopping through the woods, tripping over logs and crashing\ninto trees.  At the same time, a blind snake was slithering through the same\nforest, with identical results.  They chanced to collide head-on in a clearing.\n\t\"Please excuse me, sir, I'm blind and I bumped into you accidentally,\"\napologized the rabbit.\n\t\"That's quite all right,\" replied the snake, \"I have the same\nproblem!\"\n\t\"All my life I've been wondering what I am,\" said the rabbit, \"Do\nyou think you could help me find out?\"\n\t\"I'll try,\" said the snake.  He gently coiled himself around the\nrabbit. \"Well, you're covered with soft fur, you have a little fluffy tail\nand long ears.  You're... hmmm... you're probably a bunny rabbit!\"\n\t\"Great!\" said the rabbit.  \"Thanks, I really owe you one!\"\n\t\"Well,\" replied the snake, \"I don't know what I am, either.  Do you\nsuppose you could try and tell me?\"\n\tThe rabbit ran his paws all over the snake.  \"Well, you're low, cold\nand slimey...\"  And, as he ran one paw underneath the snake, \"and you have\nno balls.  You must be an attorney!\"\n%\nA certain old cat had made his home in the alley behind Gabe's bar for some\ntime, subsisting on scraps and occasional handouts from the bartender.  One\nevening, emboldened by hunger, the feline attempted to follow Gabe through\nthe back door.  Regrettably, only the his body had made it through when\nthe door slammed shut, severing the cat's tail at its base.  This proved too\nmuch for the old creature, who looked sadly at Gabe and expired on the spot.\n\tGabe put the carcass back out in the alley and went back to business.\nThe mandatory closing time arrived and Gabe was in the process of locking up\nafter the last customers had gone.  Approaching the back door he was startled\nto see an apparition of the old cat mournfully holding its severed tail out,\nsilently pleading for Gabe to put the tail back on its corpse so that it could\ngo on to the kitty afterworld complete.\n\tGabe shook his head sadly and said to the ghost, \"I can't.  You know\nthe law -- no retailing spirits after 2:00 AM.\"\n%\nA countryman between two lawyers is like a fish between two cats.\n\t\t-- Ben Franklin\n%\nA doctor was stranded with a lawyer in a leaky life raft in shark-infested\nwaters. The doctor tried to swim ashore but was eaten by the sharks. The\nlawyer, however, swam safely past the bloodthirsty sharks.  \"Professional\ncourtesy,\" he explained.\n%\nA Dublin lawyer died in poverty and many barristers of the city subscribed to\na fund for his funeral.  The Lord Chief Justice of Orbury was asked to donate\na shilling.  \"Only a shilling?\" exclaimed the man. \"Only a shilling to bury\nan attorney?  Here's a guinea; go and bury twenty of them.\"\n%\nA friend of mine won't get a divorce, because he hates lawyers more than he\nhates his wife.\n%\n\tA grade school teacher was asking students what their parents did\nfor a living.  \"Tim, you be first,\" she said.  \"What does your mother do\nall day?\"\n\tTim stood up and proudly said, \"She's a doctor.\"\n\t\"That's wonderful.  How about you, Amie?\"\n\tAmie shyly stood up, scuffed her feet and said, \"My father is a\nmailman.\"\n\t\"Thank you, Amie,\" said the teacher.  \"What about your father, Billy?\"\n\tBilly proudly stood up and announced, \"My daddy plays piano in a\nwhorehouse.\"\n\tThe teacher was aghast and promptly changed the subject to geography.\nLater that day she went to Billy's house and rang the bell.  Billy's father\nanswered the door.  The teacher explained what his son had said and demanded\nan explanation.\n\tBilly's father replied, \"Well, I'm really an attorney.  But how do\nyou explain a thing like that to a seven-year-old child?\"\n%\n\tA housewife, an accountant and a lawyer were asked to add 2 and 2.\n\tThe housewife replied, \"Four!\".\n\tThe accountant said, \"It's either 3 or 4.  Let me run those figures\nthrough my spread sheet one more time.\"\n\tThe lawyer pulled the drapes, dimmed the lights and asked in a\nhushed voice, \"How much do you want it to be?\"\n%\nA jury consists of twelve persons chosen to decide who has the better lawyer.\n\t\t-- Robert Frost\n%\n\tA lawyer named Strange was shopping for a tombstone.  After he had\nmade his selection, the stonecutter asked him what inscription he\nwould like on it.  \"Here lies an honest man and a lawyer,\" responded the\nlawyer.\n\t\"Sorry, but I can't do that,\" replied the stonecutter.  \"In this\nstate, it's against the law to bury two people in the same grave.  However,\nI could put ``here lies an honest lawyer'', if that would be okay.\"\n\t\"But that won't let people know who it is\" protested the lawyer.\n\t\"Certainly will,\" retorted the stonecutter.  \"people will read it\nand exclaim, \"That's Strange!\"\n%\nA Los Angeles judge ruled that \"a citizen may snore with immunity in\nhis own home, even though he may be in possession of unusual and\nexceptional ability in that particular field.\"\n%\n\tA Los Angeles judge ruled that \"a citizen may snore with immunity in\nhis own home, even though he may be in possession of unusual and exceptional\nability in that particular field.\"\n%\n\tA man walked into a bar with his alligator and asked the bartender,\n\"Do you serve lawyers here?\".\n\t\"Sure do,\" replied the bartender.\n\t\"Good,\" said the man.  \"Give me a beer, and I'll have a lawyer for\nmy 'gator.\"\n%\n\tA New York City judge ruled that if two women behind you at the\nmovies insist on discussing the probable outcome of the film, you have the\nright to turn around and blow a Bronx cheer at them.\n%\nA New York City ordinance prohibits the shooting of rabbits from the\nrear of a Third Avenue street car -- if the car is in motion.\n%\nA Riverside, California, health ordinance states that two persons may\nnot kiss each other without first wiping their lips with carbolized rosewater.\n%\nA small town that cannot support one lawyer can always support two.\n%\nAccording to Arkansas law, Section 4761, Pope's Digest:  \"No person\nshall be permitted under any pretext whatever, to come nearer than\nfifty feet of any door or window of any polling room, from the opening\nof the polls until the completion of the count and the certification of\nthe returns.\"\n%\nAccording to Kentucky state law, every person must take a bath at least\nonce a year.\n%\nAfter 35 years, I have finished a comprehensive study of European\ncomparative law.  In Germany, under the law, everything is prohibited,\nexcept that which is permitted.  In France, under the law, everything\nis permitted, except that which is prohibited.  In the Soviet Union,\nunder the law, everything is prohibited, including that which is\npermitted.  And in Italy, under the law, everything is permitted,\nespecially that which is prohibited.\n\t\t-- Newton Minow,\n\t\tSpeech to the Association of American Law Schools, 1985\n%\n\tAfter his Ignoble Disgrace, Satan was being expelled from\nHeaven.  As he passed through the Gates, he paused a moment in thought,\nand turned to God and said, \"A new creature called Man, I hear, is soon\nto be created.\"\n\t\"This is true,\" He replied.\n\t\"He will need laws,\" said the Demon slyly.\n\t\"What!  You, his appointed Enemy for all Time!  You ask for the\nright to make his laws?\"\n\t\"Oh, no!\"  Satan replied, \"I ask only that he be allowed to\nmake his own.\"\n\tIt was so granted.\n\t\t-- Ambrose Bierce, \"The Devil's Dictionary\"\n%\nAn amendment to a motion may be amended, but an amendment to an amendment\nto a motion may not be amended.  However, a substitute for an amendment to\nand amendment to a motion may be adopted and the substitute may be amended.\n\t\t-- The Montana legislature's contribution to the English\n\t\tlanguage.\n%\nAn attorney was defending his client against a charge of first-degree murder.\n\"Your Honor, my client is accused of stuffing his lover's mutilated body into\na suitcase and heading for the Mexican border.  Just north of Tijuana a cop\nspotted her hand sticking out of the suitcase.  Now, I would like to stress\nthat my client is *___\b\b\bnot* a murderer.  A sloppy packer, maybe...\"\n%\nAn English judge, growing weary of the barrister's long-winded summation,\nleaned over the bench and remarked, \"I've heard your arguments, Sir\nGeoffrey, and I'm none the wiser!\" Sir Geoffrey responded, \"That may be,\nMilord, but at least you're better informed!\"\n%\nAnd then there was the lawyer that stepped in cow manure and thought\nhe was melting...\n%\nAnother day, another dollar.\n\t\t-- Vincent J. Fuller, defense lawyer for John Hinckley,\n\t\t   upon Hinckley's acquittal for shooting President Ronald\n\t\t   Reagan.\n%\nAnti-trust laws should be approached with exactly that attitude.\n%\nAtlanta makes it against the law to tie a giraffe to a telephone pole\nor street lamp.\n%\nAttorney General Edwin Meese III explained why the Supreme Court's Miranda\ndecision (holding that subjects have a right to remain silent and have a\nlawyer present during questioning) is unnecessary: \"You don't have many\nsuspects who are innocent of a crime.  That's contradictory.  If a person\nis innocent of a crime, then he is not a suspect.\"\n\t\t-- U.S. News and World Report, 10/14/85\n%\nBe frank and explicit with your lawyer ... it is his business to confuse\nthe issue afterwards.\n%\nBehold the warranty -- the bold print giveth and the fine print taketh away.\n%\nBeing a miner, as soon as you're too old and tired and sick and stupid to\ndo your job properly, you have to go, where the very opposite applies with\nthe judges.\n\t\t-- Beyond the Fringe\n%\nBetween grand theft and a legal fee, there only stands a law degree.\n%\n... but as records of courts and justice are admissible, it can easily be\nproved that powerful and malevolent magicians once existed and were a scourge\nto mankind.  The evidence (including confession) upon which certain women \nwere convicted of witchcraft and executed was without a flaw; it is still \nunimpeachable.  The judges' decisions based on it were sound in logic and \nin law.  Nothing in any existing court was ever more thoroughly proved than\nthe charges of witchcraft and sorcery for which so many suffered death.  If\nthere were no witches, human testimony and human reason are alike destitute\nof value.\n\t\t-- Ambrose Bierce, \"The Devil's Dictionary\"\n%\nCarmel, New York, has an ordinance forbidding men to wear coats and\ntrousers that don't match.\n%\nCertain passages in several laws have always defied interpretation and the\nmost inexplicable must be a matter of opinion.  A judge of the Court of\nSession of Scotland has sent the editors of this book his candidate which\nreads, \"In the Nuts (unground), (other than ground nuts) Order, the expression\nnuts shall have reference to such nuts, other than ground nuts, as would\nbut for this amending Order not qualify as nuts (unground) (other than ground\nnuts) by reason of their being nuts (unground).\"\n\t\t-- Guiness Book of World Records, 1973\n%\nChicago law prohibits eating in a place that is on fire.\n%\nDiogenes went to look for an honest lawyer. \"How's it going?\", someone\nasked him, after a few days.\n\t\"Not too bad\", replied Diogenes. \"I still have my lantern.\"\n%\n[District Attorneys] learn in District Attorney School that there are\ntwo sure-fire ways to get a lot of favorable publicity:\n\n(1) Go down and raid all the lockers in the local high school and\n    confiscate 53 marijuana cigarettes and put them in a pile and hold\n    a press conference where you announce that they have a street value\n    of $850 million.  These raids never fail, because ALL high schools,\n    including brand-new, never-used ones, have at least 53 marijuana\n    cigarettes in the lockers.  As far as anyone can tell, the locker\n    factory puts them there.\n(2) Raid an \"adult book store\" and hold a press conference where you\n    announce you are charging the owner with 850 counts of being a\n    piece of human sleaze.  This also never fails, because you always\n    get a conviction.  A juror at a pornography trial is not about to\n    state for the record that he finds nothing obscene about a movie\n    where actors engage in sexual activities with live snakes and a\n    fire extinguisher.  He is going to convict the bookstore owner, and\n    vote for the death penalty just to make sure nobody gets the wrong\n    impression.\n\t\t-- Dave Barry, \"Pornography\"\n%\nDistrict of Columbia pedestrians who leap over passing autos to escape\ninjury, and then strike the car as they come down, are liable for any\ndamage inflicted on the vehicle.\n%\nDivorce is a game played by lawyers.\n\t\t-- Cary Grant\n%\nDoctors and lawyers must go to school for years and years, often with\nlittle sleep and with great sacrifice to their first wives.\n\t\t-- Roy G. Blount, Jr.\n%\nFights between cats and dogs are prohibited by statute in Barber, North\nCarolina.\n%\nFirst there was Dial-A-Prayer, then Dial-A-Recipe, and even Dial-A-Footballer.\nBut the south-east Victorian town of Sale has produced one to top them all.\nDial-A-Wombat.\n\tIt all began early yesterday when Sale police received a telephone\ncall: \"You won't believe this, and I'm not drunk, but there's a wombat in the\nphone booth outside the town hall,\" the caller said.\n\tNot firmly convinced about the caller's claim to sobriety, members of\nthe constabulary drove to the scene, expecting to pick up a drunk.\n\tBut there it was, an annoyed wombat, trapped in a telephone booth.\n\tThe wombat, determined not to be had the better of again, threw its\nbulk into the fray. It was eventually lassoed and released in a nearby scrub.\n\tThen the officers received another message ... another wombat in\nanother phone booth.\n\tThere it was: *Another* angry wombat trapped in a telephone booth.\n\tThe constables took the miffed marsupial into temporary custody and\nreleased it, too, in the scrub.\n\tBut on their way back to the station they happened to pass another\ntelephone booth, and -- you guessed it -- another imprisoned wombat.\n\tAfter some serious detective work, the lads in blue found a suspect,\nand after questioning, released him to be charged on summons.\n\tTheir problem ... they cannot find a law against placing wombats in\ntelephone booths.\n\t\t-- \"Newcastle Morning Herald\", NSW Australia, Aug 1980.\n%\nFor certain people, after fifty, litigation takes the place of sex.\n\t\t-- Gore Vidal\n%\nFor three years, the young attorney had been taking his brief\nvacations at this country inn.  The last time he'd finally managed an\naffair with the innkeeper's daughter.  Looking forward to an exciting\nfew days, he dragged his suitcase up the stairs of the inn, then stopped\nshort.  There sat his lover with an infant on her lap!\n\t\"Helen, why didn't you write when you learned you were pregnant?\"\nhe cried.  \"I would have rushed up here, we could have gotten married,\nand the baby would have my name!\"\n\t\"Well,\" she said, \"when my folks found out about my condition,\nwe sat up all night talkin' and talkin' and finally decided it would be\nbetter to have a bastard in the family than a lawyer.\"\n%\nFortune Documents the Great Legal Decisions:\n\nIt is a rule of evidence deduced from the experience of mankind and\nsupported by reason and authority that positive testimony is entitled to\nmore weight than negative testimony, but by the latter term is meant\nnegative testimony in its true sense and not positive evidence of a\nnegative, because testimony in support of a negative may be as positive\nas that in support of an affirmative.\n\t\t-- 254 Pac. Rep. 472.\n%\nFortune Documents the Great Legal Decisions:\n\nWe can imagine no reason why, with ordinary care, human toes could not be\nleft out of chewing tobacco, and if toes are found in chewing tobacco, it\nseems to us that someone has been very careless.\n\t\t-- 78 So. 365.\n%\nFortune Documents the Great Legal Decisions:\n\nWe think that we may take judicial notice of the fact that the term \"bitch\"\nmay imply some feeling of endearment when applied to a female of the canine\nspecies but that it is seldom, if ever, so used when applied to a female\nof the human race. Coming as it did, reasonably close on the heels of two\nrevolver shots directed at the person of whom it was probably used, we think\nit carries every reasonable implication of ill-will toward that person.\n\t\t-- Smith v. Moran, 193 N.E. 2d 466.\n%\nFortune's Law of the Week (this week, from Kentucky):\n\tNo female shall appear in a bathing suit at any airport in this\nState unless she is escorted by two officers or unless she is armed\nwith a club.  The provisions of this statute shall not apply to females\nweighing less than 90 pounds nor exceeding 200 pounds, nor shall it\napply to female horses.\n%\nFortune's nomination for All-Time Champion and Protector of Youthful\nMorals goes to Representative Clare E. Hoffman of Michigan.  During an\nimpassioned House debate over a proposed bill to \"expand oyster and\nclam research,\" a sharp-eared informant transcribed the following\nexchange between our hero and Rep. John D. Dingell, also of Michigan.\n\nDINGELL: There are places in the world at the present time where we are\n\t having to artificially propagate oysters and clams.\nHOFFMAN: You mean the oysters I buy are not nature's oysters?\nDINGELL: They may or may not be natural.  The simple fact of the matter\n\t is that female oysters through their living habits cast out\n\t large amounts of seed and the male oysters cast out large\n\t amounts of fertilization ...\nHOFFMAN: Wait a minute!  I do not want to go into that.  There are many\n\t teenagers who read The Congressional Record.\n%\nFortune's Real-Life Courtroom Quote #18:\n\nQ:  Are you married?\nA:  No, I'm divorced.\nQ:  And what did your husband do before you divorced him?\nA:  A lot of things I didn't know about.\n%\nFortune's Real-Life Courtroom Quote #19:\n\nQ:  Doctor, how many autopsies have you performed on dead people?\nA:  All my autopsies have been performed on dead people.\n%\nFortune's Real-Life Courtroom Quote #25:\n\nQ:  You say you had three men punching at you, kicking you, raping you,\n    and you didn't scream?\nA:  No ma'am.\nQ:  Does that mean you consented?\nA:  No, ma'am.  That means I was unconscious.\n%\nFortune's Real-Life Courtroom Quote #29:\n\nTHE JUDGE: Now, as we begin, I must ask you to banish all present\n\t   information and prejudice from your minds, if you have any ...\n%\nFortune's Real-Life Courtroom Quote #32:\n\nQ:  Do you know how far pregnant you are right now?\nA:  I will be three months November 8th.\nQ:  Apparently then, the date of conception was August 8th?\nA:  Yes.\nQ:  What were you and your husband doing at that time?\n%\nFortune's Real-Life Courtroom Quote #37:\n\nQ:  Did he pick the dog up by the ears?\nA:  No.\nQ:  What was he doing with the dog's ears?\nA:  Picking them up in the air.\nQ:  Where was the dog at this time?\nA:  Attached to the ears.\n%\nFortune's Real-Life Courtroom Quote #3:\n\nQ:  When he went, had you gone and had she, if she wanted to and were\n    able, for the time being excluding all the restraints on her not to\n    go, gone also, would he have brought you, meaning you and she, with\n    him to the station?\nMR. BROOKS:  Objection.  That question should be taken out and shot.\n%\nFortune's Real-Life Courtroom Quote #41:\n\nQ:  Now, Mrs. Johnson, how was your first marriage terminated?\nA:  By death.\nQ:  And by whose death was it terminated?\n%\nFortune's Real-Life Courtroom Quote #52:\n\nQ:  What is your name?\nA:  Ernestine McDowell.\nQ:  And what is your marital status?\nA:  Fair.\n%\nFortune's Real-Life Courtroom Quote #7:\n\nQ:  What happened then?\nA:  He told me, he says, \"I have to kill you because you can identify me.\"\nQ:  Did he kill you?\nA:  No.\n%\nFrankfort, Kentucky, makes it against the law to shoot off a policeman's tie.\n%\n\"Gentlemen of the jury,\" said the defense attorney, now beginning\nto warm to his summation, \"the real question here before you is, shall this\nbeautiful young woman be forced to languish away her loveliest years in a \ndark prison cell?  Or shall she be set free to return to her cozy little \napartment at 4134 Mountain Ave. -- there to spend her lonely, loveless hours\nin her boudoir, lying beside her little Princess phone, 962-7873?\"\n%\nGetting kicked out of the American Bar Association is liked getting kicked\nout of the Book-of-the-Month Club.\n\t\t-- Melvin Belli on the occcasion of his getting kicked out\n\t\t   of the American Bar Association\n%\n\tGod decided to take the devil to court and settle their differences\nonce and for all.\n\tWhen Satan heard of this, he grinned and said, \"And just where do you\nthink you're going to find a lawyer?\"\n%\nGood government never depends upon laws, but upon the personal qualities of\nthose who govern.  The machinery of government is always subordinate to the\nwill of those who administer that machinery.  The most important element of\ngovernment, therefore, is the method of choosing leaders.\n\t\t-- Frank Herbert, \"Children of Dune\"\n%\nHe is no lawyer who cannot take two sides.\n%\n\"Hi, I'm Preston A. Mantis, president of Consumers Retail Law Outlet. As you\ncan see by my suit and the fact that I have all these books of equal height\non the shelves behind me, I am a trained legal attorney. Do you have a car\nor a job?  Do you ever walk around?  If so, you probably have the makings of\nan excellent legal case.  Although of course every case is different, I\nwould definitely say that based on my experience and training, there's no\nreason why you shouldn't come out of this thing with at least a cabin\ncruiser.\n\n\"Remember, at the Preston A. Mantis Consumers Retail Law Outlet, our motto\nis: 'It is very difficult to disprove certain kinds of pain.'\"\n\t\t-- Dave Barry, \"Pain and Suffering\"\n%\n\tHorses are forbidden to eat fire hydrants in Marshalltown, Iowa.\n%\n\tHow do you insult a lawyer?\n\tYou might as well not even try.  Consider: of all the highly\ntrained and educated professions, law is the only one in which the prime\nlesson is that *winning* is more important than *truth*.\n\tOnce someone has sunk to that level, what worse can you say about them?\n%\nHR 3128.  Omnibus Budget Reconciliation, Fiscal 1986.  Martin, R-Ill., motion\nthat the House recede from its disagreement to the Senate amendment making\nchanges in the bill to reduce fiscal 1986 deficits.  The Senate amendment\nwas an amendment to the House amendment to the Senate amendment to the House\namendment to the Senate amendment to the bill.  The original Senate amendment\nwas the conference agreement on the bill.  Agreed to.\n\t\t-- Albuquerque Journal\n%\nHumor in th Court:\nQ: Do you drink when you're on duty?\nA: I don't drink when I'm on duty, unless I come on duty drunk.\n%\nHumor in the Court:\nQ.  And lastly, Gary, all your responses must be oral.  O.K.? What school do \n    you go to?\nA.  Oral.\nQ.  How old are you?\nA.  Oral.\n%\nHumor in the Court:\nQ.  And who is this person you are speaking of?\nA.  My ex-widow said it.\n%\nHumor in the Court:\nQ.  Did you ever stay all night with this man in New York?\nA.  I refuse to answer that question.\nQ.  Did you ever stay all night with this man in Chicago?\nA.  I refuse to answer that question.\nQ.  Did you ever stay all night with this man in Miami?\nA.  No.\n%\nHumor in the Court:\nQ.  Doctor, did you say he was shot in the woods?\nA.  No, I said he was shot in the lumbar region.\n%\nHumor in the Court:\nQ.  How did you happen to go to Dr. Cherney?\nA.  Well, a gal down the road had had several of her children by Dr. Cherney, \n    and said he was really good.\n%\nHumor in the Court:\nQ.  Mrs. Jones, is your appearance this morning pursuant to a deposition \n    notice which I sent to your attorney?\nA.  No.  This is how I dress when I go to work.\n%\nHumor in the Court:\nQ.  Mrs. Smith, do you believe that you are emotionally unstable?\nA.  I should be.\nQ.  How many times have you comitted suicide?\nA.  Four times.\n%\nHumor in the Court:\nQ.  Officer, what led you to believe the defendant was under the influence?\nA.  Because he was argumentary and he couldn't pronunciate his words.\n%\nHumor in the Court:\nQ.  Were you aquainted with the deceased?\nA.  Yes, sir.\nQ.  Before or after he died?\n%\nHumor in the Court:\nQ.  What is your brother-in-law's name?\nA.  Borofkin.\nQ.  What's his first name?\nA.  I can't remember.\nQ.  He's been your brother-in-law for years, and you can't remember his first \n    name?\nA.  No.  I tell you I'm too excited. (Rising from the witness chair and\n    pointing to Mr. Borofkin.) Nathan, for God's sake, tell them your first\n    name!\n%\nHumor in the Court:\nQ: (Showing man picture.) That's you?\nA: Yes, sir.\nQ: And you were present when the picture was taken, right?\n%\nHumor in the Court:\nQ: ...and what did he do then?\nA: He came home, and next morning he was dead.\nQ: So when he woke up the next morning he was dead?\n%\nHumor in the Court:\nQ: ...any suggestions as to what prevented this from being a murder trial \n   instead of an attempted murder trial?\nA: The victim lived.\n%\nHumor in the Court:\nQ: Are you qualified to give a urine sample?\nA: Yes, I have been since early childhood.\n%\nHumor in the Court:\nQ: Are you sexually active?\nA: No, I just lie there.\n%\nHumor in the Court:\nQ: Could you see him from where you were standing?\nA: I could see his head.\nQ: And where was his head?\nA: Just above his shoulders.\n%\nHumor in the Court:\nQ: Did you tell your lawyer that your husband had offered you indignities?\nA: He didn't offer me nothing; he just said I could have the furniture.\n%\nHumor in the Court:\nQ: Now, you have investigated other murders, have you not, where there was\n   a victim?\n%\nHumor in the Court:\nQ: So, after the anesthesia, when you came out of it, what did you observe\n   with respect to your scalp?\nA: I didn't see my scalp the whole time I was in the hospital.\nQ: It was covered?\nA: Yes, bandaged.\nQ: Then, later on.. what did you see?\nA: I had a skin graft. My whole buttocks and leg were removed and put on top\n   of my head.\n%\nHumor in the Court:\nQ: The truth of the matter is that you were not an unbiased, objective \n   witness, isn't it. You too were shot in the fracas?\nA: No, sir. I was shot midway between the fracas and the naval.\n%\nHumor in the Court:\nQ: What can you tell us about the truthfulness and veracity of this defendant?\nA: Oh, she will tell the truth. She said she'd kill that sonofabitch--and \n   she did!\n%\nHumor in the Court:\nQ: What is the meaning of sperm being present?\nA: It indicates intercourse.\nQ: Male sperm?\nA. That is the only kind I know.\n%\nHumor in the Court:\nQ: What is your relationship with the plaintiff?\nA: She is my daughter.\nQ: Was she your daughter on February 13, 1979?\n%\nI need another lawyer like I need another hole in my head.\n\t\t-- Fratianno\n%\nI remember when legal used to mean lawful, now it means some\nkind of loophole.\n\t\t-- Leo Kessler\n%\nI suppose some of the variation between Boston drivers and the rest of the\ncountry is due to the progressive Massachusetts Driver Education Manual which\nI happen to have in my top desk drawer.  Some of the Tips for Better Driving\nare worth considering, to wit:\n\n[110.13]:\n       \"When traveling on a one-way street, stay to the right, so as not\n        to interfere with oncoming traffic.\"\n\n[22.17b]:\n       \"Learning to change lanes takes time and patience.  The best\n        recommendation that can be made is to go to a Celtics [basketball]\n        game; study the fast break and then go out and practice it\n        on the highway.\"\n\n[41.16]:\n       \"Never bump a baby carriage out of a crosswalk unless the kid's really\n        asking for it.\"\n%\nI suppose some of the variation between Boston drivers and the rest of the\ncountry is due to the progressive Massachusetts Driver Education Manual which\nI happen to have in my top desk drawer.  Some of the Tips for Better Driving\nare worth considering, to wit:\n\n[131.16d]:\n       \"Directional signals are generally not used except during vehicle\n        inspection; however, a left-turn signal is appropriate when making\n        a U-turn on a divided highway.\"\n\n[96.7b]:\n       \"When paying tolls, remember that it is necessary to release the\n        quarter a full 3 seconds before passing the basket if you are\n        traveling more than 60 MPH.\"\n\n[110.13]:\n       \"When traveling on a one-way street, stay to the right, so as not\n        to interfere with oncoming traffic.\"\n%\nI suppose some of the variation between Boston drivers and the rest of the\ncountry is due to the progressive Massachusetts Driver Education Manual which\nI happen to have in my top desk drawer.  Some of the Tips for Better Driving\nare worth considering, to wit:\n\n[173.15b]:\n\t\"When competing for a section of road or a parking space, remember\n        that the vehicle in need of the most body work has the right-of-way.\"\n\n[141.2a]:\n       \"Although it is altogether possible to fit a 6' car into a 6'\n        parking space, it is hardly ever possible to fit a 6' car into\n        a 5' parking space.\"\n\n[105.31]:\n       \"Teenage drivers believe that they are immortal, and drive accordingly.\n        Nevertheless, you should avoid the temptation to prove them wrong.\"\n%\nI value kindness to human beings first of all, and kindness to animals.  I\ndon't respect the law; I have a total irreverence for anything connected\nwith society except that which makes the roads safer, the beer stronger,\nthe food cheaper, and old men and women warmer in the winter, and happier\nin the summer.\n\t\t-- Brendan Behan\n%\n\tIdaho state law makes it illegal for a man to give his sweetheart\na box of candy weighing less than fifty pounds.\n%\nIf a jury in a criminal trial stays out for more than twenty-four hours, it\nis certain to vote acquittal, save in those instances where it votes guilty.\n\t\t-- Joseph C. Goulden\n%\nIf a man stay away from his wife for seven years, the law presumes the\nseparation to have killed him; yet according to our daily experience,\nit might well prolong his life.\n\t\t-- Charles Darling, \"Scintillae Juris, 1877\n%\n\"If once a man indulges himself in murder, very soon he comes to think\nlittle of robbing; and from robbing he next comes to drinking and\nSabbath-breaking, and from that to incivility and procrastination.\"\n\t\t-- Thomas De Quincey (1785 - 1859)\n%\nIf reporters don't know that truth is plural, they ought to be lawyers.\n\t\t-- Tom Wicker\n%\nIf there were a school for, say, sheet metal workers, that after three\nyears left its graduates as unprepared for their careers as does law\nschool, it would be closed down in a minute, and no doubt by lawyers.\n\t\t-- Michael Levin, \"The Socratic Method\n%\n\tIn \"King Henry VI, Part II,\" Shakespeare has Dick Butcher suggest to\nhis fellow anti-establishment rabble-rousers, \"The first thing we do, let's\nkill all the lawyers.\"  That action may be extreme but a similar sentiment\nwas expressed by Thomas K. Connellan, president of The Management Group, Inc.\nSpeaking to business executives in Chicago and quoted in Automotive News,\nConnellan attributed a measure of America's falling productivity to an excess\nof attorneys and accountants, and a dearth of production experts.  Lawyers\nand accountants \"do not make the economic pie any bigger; they only figure\nout how the pie gets divided.  Neither profession provides any added value\nto product.\"\n\tAccording to Connellan, the highly productive Japanese society has\n10 lawyers and 30 accountants per 100,000 population.  The U.S. has 200\nlawyers and 700 accountants.  This suggests that \"the U.S. proportion of\npie-bakers and pie-dividers is way out of whack.\"  Could Dick Butcher have\nbeen an efficiency expert?\n\t\t-- Motor Trend, May 1983\n%\nIn Blythe, California, a city ordinance declares that a person must own\nat least two cows before he can wear cowboy boots in public.\n%\nIn Boston, it is illegal to hold frog-jumping contests in nightclubs.\n%\nIn Columbia, Pennsylvania, it is against the law for a pilot to tickle\na female flying student under her chin with a feather duster in order\nto get her attention.\n%\nIn Corning, Iowa, it's a misdemeanor for a man to ask his wife to ride\nin any motor vehicle.\n%\nIn Denver it is unlawful to lend your vacuum cleaner to your next-door neighbor.\n%\nIn Devon, Connecticut, it is unlawful to walk backwards after sunset.\n%\nIn Greene, New York, it is illegal to eat peanuts and walk backwards on\nthe sidewalks when a concert is on.\n%\nIn Lexington, Kentucky, it's illegal to carry an ice cream cone in your pocket.\n%\nIn Lowes Crossroads, Delaware, it is a violation of local law for any\npilot or passenger to carry an ice cream cone in their pocket while\neither flying or waiting to board a plane.\n%\n\tIn Memphis, Tennessee, it is illegal for a woman to drive a car unless\nthere is a man either running or walking in front of it waving a red\nflag to warn approaching motorists and pedestrians.\n%\nIn Ohio, if you ignore an orator on Decoration day to such an extent as\nto publicly play croquet or pitch horseshoes within one mile of the\nspeaker's stand, you can be fined $25.00.\n%\nIn Pocataligo, Georgia, it is a violation for a woman over 200 pounds\nand attired in shorts to pilot or ride in an airplane.\n%\nIn Pocatello, Idaho, a law passed in 1912 provided that \"The carrying\nof concealed weapons is forbidden, unless same are exhibited to public view.\"\n%\nIn Seattle, Washington, it is illegal to carry a concealed weapon that\nis over six feet in length.\n%\nIn Tennessee, it is illegal to shoot any game other than whales from a\nmoving automobile.\n%\nIn the olden days in England, you could be hung for stealing a sheep or a\nloaf of bread.  However, if a sheep stole a loaf of bread and gave it to\nyou, you would only be tried for receiving, a crime punishable by forty\nlashes with the cat or the dog, whichever was handy.  If you stole a dog\nand were caught, you were punished with twelve rabbit punches, although it\nwas hard to find rabbits big enough or strong enough to punch you.\n\t\t-- Mike Harding, \"The Armchair Anarchist's Almanac\"\n%\nIn Tulsa, Oklahoma, it is against the law to open a soda bottle without\nthe supervision of a licensed engineer.\n%\nIn West Union, Ohio, No married man can go flying without his spouse\nalong at any time, unless he has been married for more than 12 months.\n%\nIt has long been noticed that juries are pitiless for robbery and full of\nindulgence for infanticide.  A question of interest, my dear Sir!  The jury\nis afraid of being robbed and has passed the age when it could be a victim\nof infanticide.\n\t\t-- Edmond About\n%\nIt is against the law for a monster to enter the corporate limits of\nUrbana, Illinois.\n%\nIt is illegal to drive more than two thousand sheep down Hollywood\nBoulevard at one time.\n%\nIt is illegal to say \"Oh, Boy\" in Jonesboro, Georgia.\n%\nIt is Mr. Mellon's credo that $200,000,000 can do no wrong.  Our\noffense consists in doubting it.\n\t\t-- Justice Robert H. Jackson\n%\nIt is Texas law that when two trains meet each other at a railroad crossing,\neach shall come to a full stop, and neither shall proceed until the other\nhas gone.\n%\n\tIt seems these two guys, George and Harry, set out in a Hot Air\nballoon to cross the United States.  After forty hours in the air, George\nturned to Harry, and said, \"Harry, I think we've drifted off course!  We\nneed to find out where we are.\"\n\tHarry cools the air in the balloon, and they descend to below the\ncloud cover.  Slowly drifting over the countryside, George spots a man\nstanding below them and yells out, \"Excuse me!  Can you please tell me\nwhere we are?\"\n\tThe man on the ground yells back, \"You're in a balloon, approximately\nfifty feet in the air!\"\n\tGeorge turns to Harry and says, \"Well, that man *must* be a lawyer\".\n\tReplies Harry, \"How can you tell?\".\n\t\"Because the information he gave us is 100% accurate, and totally\nuseless!\"\n\nThat's the end of The Joke, but for you people who are still worried about\nGeorge and Harry: they end up in the drink, and make the front page of the\nNew York Times: \"Balloonists Soaked by Lawyer\".\n%\nIt shall be unlawful for any suspicious person to be within the municipality.\n\t\t-- Local ordinance, Euclid Ohio\n%\nIt's illegal in Wilbur, Washington, to ride an ugly horse.\n%\nIt's recently come to Fortune's attention that scientists have stopped\nusing laboratory rats in favor of attorneys.  Seems that there are not\nonly more of them, but you don't get so emotionally attached.  The only\ndifficulty is that it's sometimes difficult to apply the experimental\nresults to humans.\n\n\t[Also, there are some things even a rat won't do.  Ed.]\n%\nJudges, as a class, display, in the matter of arranging alimony, that\nreckless generosity which is found only in men who are giving away\nsomeone else's cash.\n\t\t-- P.G. Wodehouse, \"Louder and Funnier\"\n%\nJust remember: when you go to court, you are trusting your fate to\ntwelve people that weren't smart enough to get out of jury duty!\n%\nKansas state law requires pedestrians crossing the highways at night to\nwear tail lights.\n%\nKirkland, Illinois, law forbids bees to fly over the village or through\nany of its streets.\n%\nKnow how to save 5 drowning lawyers?\n\n-- No?\n\nGOOD!\n%\nLaws are like sausages.  It's better not to see them being made.\n\t\t-- Otto von Bismarck\n%\nLegislation proposed in the Illinois State Legislature, May, 1907:\n\t\"Speed upon county roads will be limited to ten miles an hour\nunless the motorist sees a bailiff who does not appear to have had a\ndrink in 30 days, when the driver will be permitted to make what he can.\"\n%\nLet us remember that ours is a nation of lawyers and order.\n%\nLet's say your wedding ring falls into your toaster, and when you stick\nyour hand in to retrieve it, you suffer Pain and Suffering as well as\nMental Anguish.  You would sue:\n\n* The toaster manufacturer, for failure to include, in the instructions\n  section that says you should never never never ever stick you hand\n  into the toaster, the statement \"Not even if your wedding ring falls\n  in there\".\n\n* The store where you bought the toaster, for selling it to an obvious\n  cretin like yourself.\n\n* Union Carbide Corporation, which is not directly responsible in this\n  case, but which is feeling so guilty that it would probably send you\n  a large cash settlement anyway.\n\t\t-- Dave Barry\n%\n... Logically incoherent, semantically incomprehensible, and legally ... \nimpeccable!\n%\nLoud burping while walking around the airport is prohibited in Halstead, Kansas.\n%\nMarijuana will be legal some day, because the many law students\nwho now smoke pot will someday become congressmen and legalize\nit in order to protect themselves.\n\t\t-- Lenny Bruce\n%\nMen often believe -- or pretend -- that the \"Law\" is something sacred, or\nat least a science -- an unfounded assumption very convenient to governments.\n%\nMinors in Kansas City, Missouri, are not allowed to purchase cap pistols;\nthey may buy shotguns freely, however.\n%\nNever put off until tomorrow what you can do today.  There might be a\nlaw against it by that time.\n%\nNEVER swerve to hit a lawyer riding a bicycle -- it might be your bicycle.\n%\nNew Hampshire law forbids you to tap your feet, nod your head, or in\nany way keep time to the music in a tavern, restaurant, or cafe.\n%\nOf ______\b\b\b\b\b\bcourse it's the murder weapon.  Who would frame someone with a fake?\n%\n\tOld Barlow was a crossing-tender at a junction where an express train\ndemolished an automobile and its occupants. Being the chief witness, his\ntestimony was vitally important. Barlow explained that the night was dark,\nand he waved his lantern frantically, but the driver of the car paid\nno attention to the signal.\n\tThe railroad company won the case, and the president of the company\ncomplimented the old-timer for his story. \"You did wonderfully,\" he said,\n\"I was afraid you would waver under testimony.\"\n\t\"No sir,\" exclaimed the senior, \"but I sure was afraid that durned\nlawyer was gonna ask me if my lantern was lit.\"\n%\nOnce he had one leg in the White House and the nation trembled under his \nroars.  Now he is a tinpot pope in the Coca-Cola belt and a brother to the\nforlorn pastors who belabor halfwits in galvanized iron tabernacles behind\nthe railroad yards.\"\n\t\t-- H.L. Mencken, writing of William Jennings Bryan,\n\t\t   counsel for the supporters of Tennessee's anti-evolution\n\t\t   law at the Scopes \"Monkey Trial\" in 1925.\n%\n... Our second completely true news item was sent to me by Mr. H. Boyce\nConnell Jr. of Atlanta, Ga., where he is involved in a law firm.  One thing\nI like about the South is, folks there care about tradition.  If somebody\ngets handed a name like \"H. Boyce,\" he hangs on to it, puts it on his legal\nstationery, even passes it to his son, rather than do what a lesser person\nwould do, such as get it changed or kill himself.\n\t\t-- Dave Barry, \"This Column is Nothing but the Truth!\"\n%\n\t\t\tPittsburgh driver's test\n\t\t\t\n(10) Potholes are\n\n\t(a) extremely dangerous.\n\t(b) patriotic.\n\t(c) the fault of the previous administration.\n\t(d) all going to be fixed next summer.\n\nThe correct answer is (b). Potholes destroy unpatriotic, unamerican,\nimported cars, since the holes are larger than the cars.  If you drive a\nbig, patriotic, American car you have nothing to worry about.\n%\n\t\t\tPittsburgh driver's test\n\n(2) A traffic light at an intersection changes from yellow to red, you should\n\n\t(a) stop immediately.\n\t(b) proceed slowly through the intersection.\n\t(c) blow the horn.\n\t(d) floor it.\n\nThe correct answer is (d). If you said (c), you were almost right, so\ngive yourself a half point.\n%\n\t\t\tPittsburgh driver's test\n\n(3) When stopped at an intersection you should\n\n\t(a) watch the traffic light for your lane.\n\t(b) watch for pedestrians crossing the street.\n\t(c) blow the horn.\n\t(d) watch the traffic light for the intersecting street.\n\nThe correct answer is (d). You need to start as soon as the traffic light\nfor the intersecting street turns yellow. Answer (c) is worth a half point.\n%\n\t\t\tPittsburgh driver's test\n\n(4) Exhaust gas is\n\n\t(a) beneficial.\n\t(b) not harmful.\n\t(c) toxic.\n\t(d) a punk band.\n\nThe correct answer is (b). The meddling Washington eco-freak communist\nbureaucrats who say otherwise are liars.  (Message to those who answered (d).\nGo back to California where you came from.  Your kind are not welcome here.)\n%\n\t\t\tPittsburgh driver's test\n\n(5) Your car's horn is a vital piece of safety equipment.  How often should\nyou test it?\n\n\t(a) once a year.\n\t(b) once a month.\n\t(c) once a day.\n\t(d) once an hour.\n\nThe correct answer is (d). You should test your car's horn at least once\nevery hour, and more often at night or in residential neighborhoods.\n%\n\t\t\tPittsburgh Driver's Test\n\n(7) The car directly in front of you has a flashing right tail light\n    but a steady left tail light.  This means\n\n\t(a) one of the tail lights is broken; you should blow your horn\n\t    to call the problem to the driver's attention.\n\t(b) the driver is signaling a right turn.\n\t(c) the driver is signaling a left turn.\n\t(d) the driver is from out of town.\n\nThe correct answer is (d).  Tail lights are used in some foreign\ncountries to signal turns.\n%\n\t\t\tPittsburgh Driver's Test\n\n(8) Pedestrians are\n\n\t(a) irrelevant.\n\t(b) communists.\n\t(c) a nuisance.\n\t(d) difficult to clean off the front grille.\n\nThe correct answer is (a).  Pedestrians are not in cars, so they are\ntotally irrelevant to driving; you should ignore them completely.\n%\n\t\t\tPittsburgh driver's test\n\n(9) Roads are salted in order to\n\n\t(a) kill grass.\n\t(b) melt snow.\n\t(c) help the economy.\n\t(d) prevent potholes.\n\nThe correct answer is (c). Road salting employs thousands of persons\ndirectly, and millions more indirectly, for example, salt miners and\nrustproofers.  Most important, salting reduces the life spans of cars,\nthus stimulating the car and steel industries.\n%\nShe cried, and the judge wiped her tears with my checkbook.\n\t\t-- Tommy Manville\n%\nSho' they got to have it against the law.  Shoot, ever'body git high,\nthey wouldn't be nobody git up and feed the chickens.  Hee-hee.\n\t\t-- Terry Southern\n%\nSome men are heterosexual, and some are bisexual, and some men don't think\nabout sex at all... they become lawyers.\n\t\t-- Woody Allen\n%\nSome of the most interesting documents from Sweden's middle ages are the\nold county laws (well, we never had counties but it's the nearest equivalent\nI can find for \"landskap\").  These laws were written down sometime in the\n13th century, but date back even down into Viking times.  The oldest one is\nthe Vastgota law which clearly has pagan influences, thinly covered with some\nChristian stuff.  In this law, we find a page about \"lekare\", which is the\nOld Norse word for a performing artist, actor/jester/musician etc.  Here is\nan approximate translation, where I have written \"artist\" as equivalent of\n\"lekare\".\n\t\"If an artist is beaten, none shall pay fines for it.  If an artist\n\tis wounded, one such who goes with hurdie-gurdie or travels with\n\tfiddle or drum, then the people shall take a wild heifer and bring\n\tit out on the hillside.  Then they shall shave off all hair from the\n\theifer's tail, and grease the tail.  Then the artist shall be given\n\tnewly greased shoes.  Then he shall take hold of the heifer's tail,\n\tand a man shall strike it with a sharp whip.  If he can hold her, he\n\tshall have the animal.  If he cannot hold her, he shall endure what\n\the received, shame and wounds.\"\n%\nSometimes a man who deserves to be looked down upon because he is a\nfool is despised only because he is a lawyer.\n\t\t-- Montesquieu\n%\nTexas law forbids anyone to have a pair of pliers in his possession.\n%\nThe animals are not as stupid as one thinks -- they have neither\ndoctors nor lawyers.\n\t\t-- L. Docquier\n%\n\tThe Arkansas legislature passed a law that states that the Arkansas\nRiver can rise no higher than to the Main Street bridge in Little Rock.\n%\nThe City of Palo Alto, in its official description of parking lot standards,\nspecifies the grade of wheelchair access ramps in terms of centimeters of\nrise per foot of run.  A compromise, I imagine...\n%\nThe difference between a lawyer and a rooster is that\nthe rooster gets up in the morning and clucks defiance.\n%\nThe District of Columbia has a law forbidding you to exert pressure on\na balloon and thereby cause a whistling sound on the streets.\n%\n\tThe judge fined the jaywalker fifty dollars and told him if he was\ncaught again, he would be thrown in jail.  Fine today, cooler tomorrow.\n%\nThe justifications for drug testing are part of the presently fashionable\ndebate concerning restoring America's \"competitiveness.\" Drugs, it has been\nrevealed, are responsible for rampant absenteeism, reduced output, and poor\nquality work.  But is drug testing in fact rationally related to the\nresurrection of competitiveness?  Will charging the atmosphere of the\nworkplace with the fear of excretory betrayal honestly spur productivity?\nMuch noise has been made about rehabilitating the worker using drugs, but\nto date the vast majority of programs end with the simple firing or the not\nhiring of the abuser.  This practice may exacerbate, not alleviate, the\nnation's productivity problem.  If economic rehabilitation is the ultimate\ngoal of drug testing, then criteria abandoning the rehabilitation of the\ndrug-using worker is the purest of hypocrisy and the worst of rationalization.\n\t\t-- The concluding paragraph of \"Constitutional Law: The\n\t\t   Fourth Amendment and Drug Testing in the Workplace,\"\n\t\t   Tim Moore, Harvard Journal of Law & Public Policy, vol.\n\t\t   10, No. 3 (Summer 1987), pp. 762-768.\n%\nThe Law, in its majestic equality, forbids the rich, as well as the poor,\nto sleep under the bridges, to beg in the streets, and to steal bread.\n\t\t-- Anatole France\n%\nThe lawgiver, of all beings, most owes the law allegiance.  He of all men\nshould behave as though the law compelled him.  But it is the universal\nweakness of mankind that what we are given to administer we presently imagine\nwe own.\n\t\t-- H.G. Wells\n%\nThe Least Successful Equal Pay Advertisement\n\tIn 1976 the European Economic Community pointed out to the Irish\nGovernment that it had not yet implemented the agreed sex equality\nlegislation.  The Dublin Government immediately advertised for an equal pay\nenforcement officer.  The advertisement offered different salary scales for\nmen and women.\n\t\t-- Stephen Pile, \"The Book of Heroic Failures\"\n%\nThe penalty for laughing in a courtroom is six months in jail; if it\nwere not for this penalty, the jury would never hear the evidence.\n\t\t-- H. L. Mencken\n%\nThe powers not delegated to the United States by the Constitution, nor\nprohibited by it to the States, are reserved to the States respectively,\nor to the people.\n\t\t-- U.S. Constitution, Amendment 10. (Bill of Rights)\n%\nThe primary requisite for any new tax law is for it to exempt enough\nvoters to win the next election.\n%\nThe state law of Pennsylvania prohibits singing in the bathtub.\n%\nThe Worst Jury\n\tA murder trial at Manitoba in February 1978 was well advanced, when\none juror revealed that he was completely deaf and did not have the\nremotest clue what was happening.\n\tThe judge, Mr. Justice Solomon, asked him if he had heard any\nevidence at all and, when there was no reply, dismissed him.\n\tThe excitement which this caused was only equalled when a second\njuror revealed that he spoke not a word of English.  A fluent French\nspeaker, he exhibited great surprised when told, after two days, that he\nwas hearing a murder trial.\n\tThe trial was abandoned when a third juror said that he suffered\nfrom both conditions, being simultaneously unversed in the English language\nand nearly as deaf as the first juror.\n\tThe judge ordered a retrial.\n\t\t-- Stephen Pile, \"The Book of Heroic Failures\"\n%\nThere is a Massachusetts law requiring all dogs to have their hind legs\ntied during the month of April.\n%\nThere is no better way of exercising the imagination than the study of law.\nNo poet ever interpreted nature as freely as a lawyer interprets truth.\n\t\t-- Jean Giraudoux, \"Tiger at the Gates\"\n%\nThere is no doubt that my lawyer is honest.  For example, when he\nfiled his income tax return last year, he declared half of his salary\nas 'unearned income.'\n\t\t-- Michael Lara\n%\n\"There was an interesting development in the CBS-Westmoreland trial:\nboth sides agreed that after the trial, Andy Rooney would be allowed to\ntalk to the jury for three minutes about little things that annoyed him\nduring the trial.\"\n\t\t-- David Letterman\n%\nThere's no justice in this world.\n\t\t-- Frank Costello, on the prosecution of \"Lucky\" Luciano by\n\t\t   New York district attorney Thomas Dewey after Luciano had\n\t\t   saved Dewey from assassination by Dutch Schultz (by ordering\n\t\t   the assassination of Schultz instead)\n%\nThis product is meant for educational purposes only.  Any resemblance to real\npersons, living or dead is purely coincidental.  Void where prohibited.  Some\nassembly may be required.  Batteries not included.  Contents may settle during\nshipment.  Use only as directed.  May be too intense for some viewers.  If\ncondition persists, consult your physician.  No user-serviceable parts inside.\nBreaking seal constitutes acceptance of agreement.  Not responsible for direct,\nindirect, incidental or consequential damages resulting from any defect, error\nor failure to perform.  Slippery when wet.  For office use only.  Substantial\npenalty for early withdrawal.  Do not write below this line.  Your cancelled\ncheck is your receipt.  Avoid contact with skin.  Employees and their families\nare not eligible.  Beware of dog.  Driver does not carry cash.  Limited time\noffer, call now to insure prompt delivery.  Use only in well-ventilated area.\nKeep away from fire or flame.  Some equipment shown is optional.  Price does\nnot include taxes, dealer prep, or delivery.  Penalty for private use.  Call\ntoll free before digging.  Some of the trademarks mentioned in this product\nappear for identification purposes only.  All models over 18 years of age.  Do\nnot use while operating a motor vehicle or heavy equipment.  Postage will be\npaid by addressee.  Apply only to affected area.  One size fits all.  Many\nsuitcases look alike.  Edited for television.  No solicitors.  Reproduction\nstrictly prohibited.  Restaurant package, not for resale.  Objects in mirror\nare closer than they appear.  Decision of judges is final.  This supersedes\nall previous notices.  No other warranty expressed or implied.\n%\nVirginia law forbids bathtubs in the house; tubs must be kept in the yard.\n%\nWe may not like doctors, but at least they doctor.  Bankers are not ever\npopular but at least they bank.  Policeman police and undertakers take\nunder.  But lawyers do not give us law.  We receive not the gladsome light\nof jurisprudence, but rather precedents, objections, appeals, stays,\nfilings and forms, motions and counter-motions, all at $250 an hour.\n\t\t-- Nolo News, summer 1989\n%\nWe should realize that a city is better off with bad laws, so long as they \nremain fixed, then with good laws that are constantly being altered, that\nthe lack of learning combined with sound common sense is more helpful than\nthe kind of cleverness that gets out of hand, and that as a general rule,\nstates are better governed by the man in the street than by intellectuals.\nThese are the sort of people who want to appear wiser than the laws, who\nwant to get their own way in every general discussion, because they feel that\nthey cannot show off their intelligence in matters of greater importance, and\nwho, as a result, very often bring ruin on their country.\n\t\t-- Cleon, Thucydides, III, 37 translation by Rex Warner\n%\nWelcome to Utah.\nIf you think our liquor laws are funny, you should see our underwear!\n%\nWhat do you have when you have six lawyers buried up to their necks in sand?\nNot enough sand.\n%\nWhen alerted to an intrusion by tinkling glass or otherwise, 1) Calm\nyourself 2) Identify the intruder 3) If hostile, kill him.\n\nStep number 3 is of particular importance.  If you leave the guy alive\nout of misguided softheartedness, he will repay your generosity of spirit\nby suing you for causing his subsequent paraplegia and seek to force you\nto support him for the rest of his rotten life.  In court he will plead\nthat he was depressed because society had failed him, and that he was\nlooking for Mother Teresa for comfort and to offer his services to the\npoor.  In that lawsuit, you will lose.  If, on the other hand, you kill\nhim, the most that you can expect is that a relative will bring a wrongful\ndeath action. You will have two advantages: first, there be only your\nstory; forget Mother Teresa.  Second, even if you lose, how much could\nthe bum's life be worth anyway?  A Lot less than 50 years worth of\nparalysis.  Don't play George Bush and Saddam Hussein.  Finish the job.\n\t-- G. Gordon Liddy's \"Forbes\" column on personal security\n%\nWhere it is a duty to worship the sun it is pretty sure to be a crime to\nexamine the laws of heat.\n\t\t-- Christopher Morley\n%\nWhy does a hearse horse snicker, hauling a lawyer away?\n\t\t-- Carl Sandburg\n%\nWhy does New Jersey have more toxic waste dumps and California have\nmore lawyers?\n\nNew Jersey had first choice.\n%\nWith Congress, every time they make a joke it's a law; and every time\nthey make a law it's a joke.\n\t\t-- Will Rogers\n%\n"

/***/ }
/******/ ]);