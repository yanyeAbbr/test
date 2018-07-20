const news = require('../modle/news');
const notes = require('../modle/notes');
exports.index = function (req, res) {
    let data = {};
    news.find({}).limit(20).sort({_id:-1}).exec(function (err, result) {
        data.news = result;
        notes.find({}).limit(9).sort({_id:-1}).exec(function (err1, result1) {
            data.notes = result1;
            res.render('index',{result: data})
        })
    });
};