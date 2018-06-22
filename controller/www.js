exports.index = function (req, res) {
    var data = {
        name:req.session.name,
        isAdministrator : req.session.isAdministrator ? req.session.isAdministrator : false
    }
    res.render('index',{result: data})
};