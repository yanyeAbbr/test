const controller = require('../controller/admin_notes');
module.exports = function (app) {
    console.error('这里是 路由里的 admin_notes 文件');
    app.get('/admin_notes',controller.index);

};
