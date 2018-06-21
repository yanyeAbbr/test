const controller =  require('../controller/www');

module.exports = function (app) {
    console.error('这里是 路由里的www 文件');
    app.get('/',controller.index);
};