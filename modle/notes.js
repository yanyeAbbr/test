const mongoose = require('mongoose');

    let schema = {
        title: String,  // 标题
        classify : String, // 分类
        body: String,   //  内容
        UpdateDate: {   // 更新时间
            type: String,
            default : new Date()
        },
        contentId: String  // 关联id
    };
    let Notes = mongoose.model('Notes',schema);

module.exports = Notes;