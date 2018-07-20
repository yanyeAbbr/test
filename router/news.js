const controller =  require('../controller/news');

module.exports = function (app) {
    console.error('这里是 路由里的www 文件');
    app.get('/news/more',controller.newsMore);
};