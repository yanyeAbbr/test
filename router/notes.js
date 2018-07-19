const controller =  require('../controller/notes');

module.exports = function (app) {
    console.error('这里是 路由里的 notes 文件');
    app.get('/admin/notes_index',controller.index); // 笔记主页
    app.all('/admin/notes/:id',controller.api); // 笔记保存删除修改 api
};