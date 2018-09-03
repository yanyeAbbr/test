const mongoose = require('mongoose');

let Schema = {
    name: String,
    info: Object,
    url: Array
};

let TV = mongoose.model('TV', Schema);


module.exports = TV;