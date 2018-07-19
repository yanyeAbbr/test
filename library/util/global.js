//全生命周期通用方法库
const timeago = require("timeago.js");


const _$$ = {
    timeAgo : function (date) { //    时间 2 hours ago'
        let time = timeago();
        return  time.format(date)
    }
};
module.exports = _$$;