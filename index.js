var cowsay = require("./cowsay");
var fortune = require("./fortune")

var content = document.getElementById('content');

content.innerHTML = cowsay.say({
    text : fortune.fortune() || "pas de fortune pour l'instttannt",
}, 1);