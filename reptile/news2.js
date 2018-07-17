
const superagent = require('superagent');
require('superagent-charset');
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
const _ = require('lodash');
const async = require('async');
require('../modle/mongoose');
const news = require('../modle/news');

 function reptileMover () {

     let pageUrl = [],
         urlArray = [],
         contentArr = [],
         eq = new eventproxy();

// 1 访问地址   http://www.chinanews.com/scroll-news/news2.html
     for (let i=1; i < 10; i++){
         pageUrl.push('http://www.chinanews.com/scroll-news/news'+i+'.html')
     }
// 拿到每页的新闻链接
     let ff = 0;
     pageUrl.forEach(function (ele, index) {
         superagent.get(ele)
             .end(function (err, result) {
                 // 使用jq 解析
                 if(result && result.text){
                     let $ = cheerio.load(result.text);
                     // 拿到所有的链接标签  得到的是伪数组
                     let aArr = $('.dd_bt a');
                     // 循环取出链接
                     for(let i =0; i< aArr.length; i++){
                         let href = 'http:'+ aArr.eq(i).attr('href');
                         console.log('正在获取第'+index+'页的第'+i+'个链接，它是：',href);
                         urlArray.push(href);
                         eq.emit('new3',href)
                     }
                 }else{
                     reptileMover();
                     ff++;
                     console.log('重启'+ff+'次失败');
                     if(ff === 10){
                         throw error('重启'+ff+'次失败','中断进程...')
                     }
                 }

             })
     });

// 拿到所有链接后 继续 访问这些链接 来 获取内容   ---- 前面事件代理 eventproxy 发射了一些东西 相当于计数器
     eq.after('new3',pageUrl.length * 125, function (result) {
         // 当 new3事件 -- 触发了******* 次 --  启动回调  -- callback -- 接收发射的第二个参数
         let url = _.unionWith(urlArray);  // 去重
         console.log('小计：',url.length);

         //  控制并发数
         let sum = 0;
         let reptileMover = function (url, callback) {
             let delay =  parseInt( Math.random() * 300000000 % 5000, 10);  // 延迟
             sum++;
             console.log('当前的并发是'+sum+' 正在抓取的是:',url, '耗时：',delay); // 输出
             let love = ['卫星', '台湾','武器','暴雨','外交','老人','住房','中方']; // 我的关注
             let annoying = ['安倍', '日本']; // 讨嫌的
             superagent.get(url)
                 .charset('gbk')
                 .set('encoding','binary')
                 .end(function (err, result) {
                     if(err){
                         console.log('错误');
                     }else{
                         let $ = cheerio.load(result.text, {decodeEntities: false});
                         let title = _.trim( $('h1').html() );
                         let info = '';
                         let normal = _.trim( $('.left-time .left-t').text() );
                         let general = _.trim( $('.content_title .left p').text() );
                         let abnormal = _.trim( $('#cont_show .blank10').prev().text() );
                         if( normal !== ''){
                             info = normal
                         }else if(general !== ''){
                             info = general
                         }else if(abnormal !== ''){
                             info = abnormal
                         }
                         /*
                         * str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
                         * str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
                         * str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
                         * str=str.replace(/ /ig,'');//去掉
                         * str=str.replace(/^[\s　]+|[\s　]+$/g, "");//去掉全角半角空格
                         * str=str.replace(/[\r\n]/g,"");//去掉回车换行
                         * */
                         // 找自己关注的  去除讨厌的  再存入数据库
                         let re = /^([^日本]|[^安倍]f)+$/;
                         love.forEach(function (ele) {
                             if(title.indexOf(ele) !== -1){
                                 if(re.test(title)){
                                     saveData({title:title,url:url,info:info,key:ele});
                                 }
                             }
                         })
                     }
                 });
             setTimeout(function () {
                 sum--;
                 callback(null,1)
             },delay)

         };
         async.mapLimit(urlArray,5,function (url,callback) {
             // urlArray 每个都需要调用这个函数
             reptileMover(url,callback)
         },function (result) {
             // 当全部完成调用这里的函数
             // console.log(contentArr);
             // 操作
             time(300)
         })
     });


     // 保存数据
     function saveData(data) {
         const newModel = new news();
         news.find({title: data.title},function (err, result) {
             if(err){
                 console.log('错误❎')
             }else{
                 if(result.length !== 0){
                     console.log('相同，不保存数据')
                 }else{
                     newModel.title= data.title;
                     newModel.url= data.url;
                     newModel.info= data.info;
                     newModel.key= data.key;
                     newModel.save(function (save_error, save_result) {
                         if(save_error){
                             console.log('保存时错误')
                         }else{
                             console.log(save_result, '数据保存完成。。')
                         }
                     })
                 }
             }
         });
         // 查询 标题是否相同 相同去重
     }
 }

    reptileMover();

    // 定时抓取数据
    function time (time) {
     let sum = time;
     let interval = setInterval(function () {
         sum--;
         console.log('距离下次重启还有'+sum+'秒');
         if(sum === 0){
             console.log('开始重启....');
             sum = time;
             reptileMover();
             clearInterval(interval)
         }
     },1000);
 }

