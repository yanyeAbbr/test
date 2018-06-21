var fs = require("fs");
var path = require('path');

exports.loadLang = function (req, res) {
    /*
    * 定义 一些变量包括  支持的模板语言（support_template_language）  模板语言（template_language）  语言（text_language）  support_template_locales 本地化的一些服务 对应关系等
    *
    *  给这些变量赋值
    *
    * */
    $CONFIG.support_template_language = {};  //支持的模板语言
    $CONFIG.text_language = {}; //  语言
    $CONFIG.support_template_locales = {}; //支持的模板语言 本地服务

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

    // require('../../locales/en');
    // require('../../locales/zh-CN');

};
