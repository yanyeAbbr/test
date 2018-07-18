exports.index = function (req, res) {
    if(req.session.login){
        let data = {};
        res.render('admin/home',data)
    }else{
        res.redirect('/Administrator/login')
    }

};