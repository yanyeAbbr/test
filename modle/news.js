const mongoose = require('mongoose');

let Schema = {
    title: String,
    url: String,
    info: String,
    key: String
};

let NEWS = mongoose.model('NEWS', Schema);


module.exports = NEWS;