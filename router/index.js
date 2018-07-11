
module.exports = function (app) {
    console.error('这里是router 文件下的 indexjs');
    require('./authentication')(app);  //多语言
    require('./www')(app);  //  主页面
    require('./user')(app); // 用户相关
    require('./Administrator')(app)  // 管理员登录退出
};
