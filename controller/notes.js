const mongoose = require('mongoose');
const formidable = require('formidable');
const notes = require('../modle/notes');
exports.index = function (req, res) {
    res.render('admin/notes_index')
};
exports.api = function (req, res) {
    const form = new formidable.IncomingForm();
    let code = {
        err: 0
    };
    let agv = req.params.id;
    switch (agv){
        case 'saveNotes':
            form.parse(req, function(err, fields) {
                notes.create(fields,function (err,result) {
                    if(err){
                        console.error(err, 'notes api throw error')
                    }else{
                       res.json(code)
                    }
                })
            });
            break;
    }
};

exports.details = function (req, res) {
    let id = req.params.id;
    notes.find({_id:id},function (err, result) {
        if(err){
            console.error(err, 'notes api throw error')
        }else{
           res.render('notes_ditails',result[0])
        }
    });

};