var fortunes = require('./loader').default;

(function(){
    var fortune = {};

    fortune.fortune = function(){
        var r = Math.floor(Math.random() * fortunes.length);
        return fortunes[r];
    };

    module.exports = fortune;
})();
