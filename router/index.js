
module.exports = function (app) {
    console.error('这里是router 文件下的 indexjs');
    require('./authentication')(app);
    require('./www')(app);
    require('./user')(app);
    require('./Administrator')(app)
};
