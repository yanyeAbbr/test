let controller = require('../controller/authentication');


module.exports = function (app) {
    console.error('这里是 路由里的 authentication 文件');
    app.use(controller.index);
};
