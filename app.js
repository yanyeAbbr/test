const express = require('express');
const app = express();
require('./library/config');
const localeService =  require('./library/localeService/locale');   // 多语言入口
const mongoose = require('./modle/mongoose');  // 打开数据库
const session = require('express-session');
var path = require('path');

localeService.loadLang();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24*7 }
}));

app.use(express.static(path.join(__dirname, 'public'), {maxAge: '7 days'}));
app.use(express.static('public'));
app.set('views', [path.join(__dirname, 'views')]);
app.set('view engine','.ejs');
// app.use(express.static('views',{maxAge: '7 days'}));
require('./router')(app);



app.use(function (req, res) {
    res.send('404, 出错了')
});


app.listen(3000,function () {
    console.log('http://localhost:3000')
});