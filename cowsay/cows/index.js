var req = require.context("./", true, /^(.*\.(cow$))[^.]*$/igm);
req.keys().forEach(function(key){
    req('raw!'+key);
});