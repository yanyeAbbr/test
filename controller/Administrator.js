
exports.index = function (req, res) {
    let params = req.params.id;
    if(params === 'login'){
       res.render('Administrator.ejs')
    }
    if(params === 'logout'){
        console.log('管理员退出')
    }
};