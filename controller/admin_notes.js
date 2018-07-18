exports.index = function (req, res) {
    if(req.session.login){
        let data = {};
        res.render('admin/notes',data)
    }else{
        res.redirect('/Administrator/login')
    }
};