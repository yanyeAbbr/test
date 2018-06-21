var crypto = require('crypto');
module.exports = function(input){
    var md5 = crypto.createHash('md5');
    var password = md5.update(input).digest('base64');
    return password
};