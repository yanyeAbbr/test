exports.index = function (req, res) {
    var data = {
        name:req.session.name,
        isAdministrator : req.session.isAdministrator ? req.session.isAdministrator : false,
        err:req.session.err ? req.session.err : 0
    };
    res.render('index',{result: data})
};