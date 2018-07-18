
exports.index = function (req, res) {
    let params = req.params.id;
    if(params === 'login'){
       res.render('administrator.ejs')
    }
    if(params === 'logout'){
        req.session.login = false;
        console.log('管理员退出')
    }
};