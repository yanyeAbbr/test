let controller = require('../controller/admin_news');


module.exports = function (app) {
    console.error('这里是 路由里的 admin_news 文件');
    app.get('/admin_news',controller.index);
    app.get('/admin/index', controller.index);
    app.get('/admin/', controller.index);
};
