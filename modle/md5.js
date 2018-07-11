var crypto = require('crypto');
module.exports = function(input){
    var md5 = crypto.createHmac('sha256', input)
        .update('I love you')
        .digest('hex');
    return md5
};