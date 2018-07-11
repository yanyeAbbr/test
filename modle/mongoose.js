const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yanye');

let db = mongoose.connection;

db.once('open',function () {
    console.log('数据库 打开成功')
});