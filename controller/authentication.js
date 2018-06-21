var util = require('util');
exports.index = function (req, res, next) {
    res.locals.$_$ = {
        req_url: req.url,//请求url
        req_query: req.query,
        req_body: req.body,
        ua: req.headers['user-agent'],//用户UA
        html_lang: '',//页面模板语言标签,
        mc_qs: '',//客户端hl,aid,flavor,cv,sv
        ga_insert: false,//模板设置插入GA代码
    };
    let ll_key = 'en';
        //设置用户设置语言
    if(req.session.lang !== undefined){
        ll_key = req.session.lang
    }

    if (req.query.hl && util.isString(req.query.hl) && $CONFIG.support_template_language[req.query.hl]) {
        ll_key = $CONFIG.support_template_language[req.query.hl];
        req.session.lang =  ll_key;
        console.log(ll_key,'>>>>>>>>>>>');
    }else if ($CONFIG.route_locales_regex.test(req.url)) {
        let ul = $CONFIG.route_locales_regex.exec(req.url);
        if (ul[1]) {
            ll_key = ul[1].toLowerCase();
        }
    }
    //查找对应模板语言
    let locale = $CONFIG.support_template_locales[ll_key];
    let tl = locale.tl;
        // res.locals.$_$.html_lang = locale.country.name

    //views闭包多语言模板数据
    (function (o, tl) {
        o.$GET = o.$_$.$GET = function (key) {
            if (arguments.length == 1) {
                return $CONFIG.text_language[tl][key];
            }
            return String.prototype.format.apply(
                $CONFIG.text_language[tl][key],
                Array.prototype.slice.call(arguments, 1)
            );
        };
    })(res.locals, tl);
    next();
};