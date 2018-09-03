const superagent = require('superagent'); // 请求页面
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
const _ = require('lodash');
const async = require('async');
require('../modle/mongoose');
const tv = require('../modle/tv');
let reptlieArr = [ { text: '热门电影', href: 'http://www.56mc.com/type/1.html'},
        { text: '热门电视剧', href: 'http://www.56mc.com/type/2.html'},
        { text: '综艺', href: 'http://www.56mc.com/type/4.html'},
        { text: '音乐', href: 'http://www.56mc.com/type/6.html'},
        { text: '动漫', href: 'http://www.56mc.com/type/7.html'},
        { text: '舞曲', href: 'http://www.56mc.com/type/11.html'} ],
    tvUrlArr = [],
    tvAllUrl = [],
    tvInTohref = [],
    movieUrl = [],
    movieUrlArr = [],
    eq = new eventproxy();

// 访问地址  http://www.56mc.com/
let trnUrl = 'http://www.56mc.com/';
// ------------------------------抓取热门电视剧-------------------- //
// step1 拿到所有网址 ing...   访问该页  获取所有页面链接
function step1 (){
    return new Promise(function (resolve, reject) {
        superagent.get(reptlieArr[1].href).end(function (err,result) {
            if(err){console.error(err); reject(err)}
            if(result && result.text){
                let $ = cheerio.load(result.text);
                let countPage =  parseInt($('.footer').prev().children().last('.div').children('a').last().attr('href').split('/')[3].replace('.html',''));
                for(let i = 0; i< 10; i++){   // countPage danger
                    tvUrlArr.push('http://www.56mc.com/type/2/'+i+'.html')
                }
                resolve(tvUrlArr)
            }
        });
    })
}
// step2 拿到每页的链接 获取基本信息 ing...
function step2(allUrl) {
    return new Promise(function (resolve, reject) {
       allUrl.forEach(function (ele, index) {
           superagent.get(ele).end(function (err,result) {
               if(err){console.log(err); reject({where:ele,status:'error'})}
               if(result && result.text){
                   let $ = cheerio.load(result.text);
                //   let itemUrl =  parseInt($('.footer').prev().children().last('.div').children('a').last().attr('href').split('/')[3].replace('.html',''));
                   let movieArr = $('.movie-item');
                    Array.from(movieArr).forEach(function (ele, i) {
                        let href = 'http://www.56mc.com'+$(ele).children('a').attr('href')+'';
                        tvAllUrl.push(href);
                        eq.emit('tv',href);
                        console.log('正在获取第'+index+'页的第'+i+'个链接，它是：',href);
                    })
               }else{
                   reject({where:result,status:'result.text'});
               }

           })
       });
        // 拿到所有链接后 继续 访问这些链接 来 获取内容   ---- 前面事件代理 eventproxy 发射了一些东西 相当于计数器
        eq.after('tv',3 * 15 - 14, function () {  //allUrl.length * 15 - 14 danger
            //  控制并发数
            let sum = 0;
            function reptileMover(url,callback) {
                let delay =  parseInt( Math.random() * 300000000 % 5000, 10);  // 延迟
                sum++;
                console.log('当前的并发是'+sum+' 正在抓取的是:',url, '耗时：',delay); // 输出
                superagent.get(url).end(function (err, result) {
                    if(err){console.log(err); reject({where:url,status:'error'})}
                    let $ = cheerio.load(result.text, {decodeEntities: false});
                    let tr = $("tr");
                    let tvInfo = {
                        name : $('.img-thumbnail').attr('alt'),
                        status :  $('.hdtag').text(),
                        dis : $(".summary").html(),
                        direct: tr.eq(0).children('.span2').next('td').text(),
                        casts: $('.casts').text(),
                        class: tr.eq(2).children('.span2').next('td').text(),
                        production: tr.eq(3).children('.span2').next('td').text(),
                        update: tr.eq(5).children('.span2').next('td').text(),
                        star: tr.eq(6).children('.span2').next('td').text(),
                        img: $('.img-thumbnail').attr('src'),
                    };
                    let href = 'http://www.56mc.com'+$('.online-button').children('a').attr('href')+'';
                    tvInTohref.push(href);
                    saveData(tvInfo,function (err, result) {
                        if(err){console.log(err)}
                        if(result){
                            console.log(result,'保存成功！');
                        }
                    })
                });
                setTimeout(function () {
                    sum--;
                    callback()
                },delay)
            }
            async.mapLimit(tvAllUrl,5,function (url,callback) {
                // urlArray 每个都需要调用这个函数
                reptileMover(url,callback)
            },function () {
                // 当全部完成调用这里的函数
                console.log('ok');
                resolve(tvInTohref)
                // 操作
            })
        })
    })
}

function saveData (data,callback){
    const tvModel = new tv();
    console.log('准备阶段','>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    tv.find({name: data.name},function (err,result) {
        if(err){console.log(err,'查询时出错')}
        if(result){
            if(result.length !== 0){
                console.log('相同，不保存数据')
            }else{
                tvModel.name = data.name;
                tvModel.info = data;
                tvModel.save(function (err, result) {
                    if(err){console.log('保存失败了...');callback(err,null)}
                    if(result){
                        callback(null,result)
                    }
                })
            }
        }
    })
}

// step3 获取每个电视剧的播放地址 ing...
function step3 (tvHref) {
    console.log(tvHref, '>>>>>>>>>>>>>>>>>')
}





Promise.resolve()
    .then(step1)
    .then(step2)
    .then(function (result) {
        console.log(result,'>>>>>')
    })
    .catch(function () {
        console.log('错误')
    });






