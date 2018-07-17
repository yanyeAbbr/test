const news = require('../modle/news');
exports.index = function (req, res) {
    var data = {
        name:req.session.name,
        isAdministrator : req.session.isAdministrator ? req.session.isAdministrator : false,
        err:req.session.err ? req.session.err : 0,
    };
    news.find({}).limit(20).exec(function (err, result) {
        data.news = result;
        res.render('index',{result: data})
    });
};