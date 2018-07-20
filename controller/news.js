const news = require('../modle/news');


exports.newsMore = function (req, res) {
    let data = {};
    let query = req.query;
    let pageSize = query.limit ? parseInt(query.limit) : 20;
    let pageIndex = query.page ? (query.page) : 1;
    data.pageIndex = pageIndex;
    news.find({}).sort({_id: -1}).limit(pageSize).skip((pageIndex-1) * pageSize).exec(function (err, result) {
        data.news = result;
        news.find({}).count().exec(function (err,reslt1) {
            data.count = reslt1;
            res.render('news_ditails',{result: data})
        });
    });

};