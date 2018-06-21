var fs = require("fs");
var path = require('path');

exports.loadLang = function (req, res) {
    $CONFIG.support_template_language = {};  //支持的模板语言
    $CONFIG.template_language = [];   // 模板语言
    $CONFIG.text_language = {}; //  语言
    $CONFIG.support_template_locales = {};
    $CONFIG.template_locales = [];

    let langPath = path.join(__dirname, '../../locales');  // 语言文件路径
    fs.readdirSync(langPath).filter(function (file) {   // 读 locales 文件夹
        if(!/^\..*/.test(file) && file.lastIndexOf('.js') != -1){
            return true
        }
        return false;
    }).forEach(function (ele, index) {
        let fileName = path.join(langPath, ele);
        require(fileName);
    });

    //  [ 'ar', 'de', 'en', 'cn' ] '>>>>'
    for (var key in $CONFIG.support_template_language) {
        if ($CONFIG.template_language.indexOf($CONFIG.support_template_language[key]) == -1) {
            $CONFIG.template_language.push($CONFIG.support_template_language[key]);
        }
    }


    var lls = [];
    for (var key in $CONFIG.support_template_locales) {
        var o = $CONFIG.support_template_locales[key];
        if (o.ll) {
            lls.push(o.ll)
        }
        $CONFIG.template_locales.push(o);
    }
    if ($CONFIG.template_locales.length > 0) {
        $CONFIG.template_locales.sort(getSortFun('asc', 'order'));
    }

    $CONFIG.route_locales_regex = new RegExp('^\/(' + lls.join('|') + ')(\/|$)', 'i');
    console.log('初始化  模板语言 ->', $CONFIG.template_language);
    console.log('初始化  模板 当地 ->', $CONFIG.template_locales);
    console.log('初始化 route locales regex ->', $CONFIG.route_locales_regex);
};
function getSortFun(order, sortBy) {
    var ordAlpah = (order == 'asc') ? '>' : '<';
    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    return sortFun;
}