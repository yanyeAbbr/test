const controller = require('../controller/Administrator')

module.exports = function (app) {
    console.error('这里是 路由里的 Administrator 文件');
     app.get('/Administrator/:id', controller.index)
};