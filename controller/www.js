exports.index = function (req, res) {
    console.log(req.session.name)
    res.render('index',{result:req.session.name})
};