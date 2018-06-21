const mongoose = require('mongoose');

let userSchema = {
    name:String,
    password:String,
    email:String,
    AssociationID:Number,
    id:String
};

let USER = mongoose.model('USER', userSchema);


module.exports = USER;