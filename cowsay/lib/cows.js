var replacer = require("./replacer");
var cows = {
	default: require("text!../cows/default.cow"),
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
