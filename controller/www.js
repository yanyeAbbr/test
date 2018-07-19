const news = require('../modle/news');
const notes = require('../modle/notes');
exports.index = function (req, res) {
    var data = {
        name:req.session.name,
        isAdministrator : req.session.isAdministrator ? req.session.isAdministrator : false,
        err:req.session.err ? req.session.err : 0,
    };
    news.find({}).limit(20).exec(function (err, result) {
        data.news = result;
        notes.find({}).limit(9).exec(function (err1, result1) {
            data.notes = result1;
            res.render('index',{result: data})
        })

    });

};