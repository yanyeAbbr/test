const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const user = require('../modle/users');
const request = require('request');
const bodyParser = require('body-parser');
const md5 = require('../modle/md5');


let jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {
    let data = {
        err : 0,
        name : '',
        isAdministrator: false,
    };

    console.error('这里是 路由里的userjs 文件');
    let github_oauth = {
        clientID: '722b939ee186f3fade40',
        clientSecret: '93ef97ec2675243f184ebd653af3294ce630b123',
        callbackURL: "http://localhost:3000/auth/github/callback"
    };
    let google_oauth = {
        clientID: '824322725584-atbd4mn5m7cg53j1jvaoh1oshn6ntpui.apps.googleusercontent.com',
        clientSecret: 'taDq0BiqWuia6iVDbpijHfTt',
        callbackURL: "http://localhost:3000/auth/google/callback"
    };

    // 序列化用户？？？？？？？？？？？？？？？
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    //初始化
    app.use(passport.initialize());

    //调用 社交平台 授权  --github --google
    app.get('/auth/:id', function (req, res) {
        let id = req.params.id;
        switch (id) {
            case 'github':
                fnuse('github');
                passport.authenticate('github');
                res.redirect('/auth/github/callback');
                break;
            case 'google':
                fnuse('google');
                passport.authenticate('google', {scope: ['profile']});
                res.redirect('/auth/google/callback');
                break;
        }
    });
    function fnuse(op) {
        let a = null;
        var b = null;
        if (op === 'google') {
            a = google_oauth;
            b = GoogleStrategy;
        }
        if (op === 'github') {
            a = github_oauth;
            b = GitHubStrategy;
        }

        //  授权后获得的用户信息。。。。
        passport.use(new b(a,
            function (accessToken, refreshToken, profile, cb) {
            if(profile.displayName === '闫野' || profile.displayName === 'yanye'){
                console.log('我是管理员....');
                data.isAdministrator = true;
            }
                data.name = profile.displayName;
                return cb(null, profile);
            }
        ));
    }
    // 授权成功的回调函数以及各种限制 重定向到主页
    app.get('/auth/github/callback', passport.authenticate('github'), function (req, res) {
        req.session.name = data.name;
        req.session.isAdministrator = data.isAdministrator;
        res.redirect('/')
    });
    app.get('/auth/google/callback', passport.authenticate('google', {scope: ['profile']}), function (req, res) {
        req.session.name = data.name;
        req.session.isAdministrator = data.isAdministrator;
        res.redirect('/')
    });


    //注册
    app.post('/doregister', urlencodedParser, function (req, res) {
        if (!req.body) return res.sendStatus(400);
     let name  = req.body.name;
     let pas  = req.body.password;
     let password = md5(md5(pas,'ya'),'hu');
     let email  = req.body.email;
        user.find({name:req.body.name},function (err, data) {
           if (err){
               data.err =  1 // 数据库错误
           }else{
               if(data.length !== 0){
                   data.err =  2 // 已注册
               }else{
                   user.create({
                       name:name,
                       email:email,
                       password:password
                   },function (err, data) {
                       if(err){
                           console.log(err)
                       }else{
                         req.session.name = name;
                           res.redirect('/')
                       }
                   })
               }
           }

        })

    });
    // 登录
    app.post('/login', urlencodedParser,function (req, res) {
        let name  = req.body.name;
        let pas  = req.body.password;
        let password = md5(md5(pas,'ya'),'hu');
        console.log(name,pas);
        user.find({name:name},function (err, d) {
            if(d.length === 0){
                 data.err = 1;
            }else{
                if(d[0].password === password){
                    if(name === '闫野' || name === 'yanye'){
                        req.session.isAdministrator = true;
                    }else{
                        req.session.isAdministrator = false;
                    }
                    req.session.name =  name;
                    data.err = 0;
                }else{
                    data.err = 2; // 密码错误
                }
            }
            res.json({result:data})
        });

    });

    // 后台登录

    app.post('/admin/login',urlencodedParser,function (req, res) {
        let name = req.body.name,
            password = req.body.password,
            count = 0;
        let code = {
            error : 0
        };
        let administrator = [{'name':'yanye','password':'111'},{'name':'liulaoda','password':'meiguihua'},{'name':'fff','password':'sss'}];
        administrator.forEach(function (ele) {
            count++;
            if(name === ele.name){
                if(password !== ele.password){
                    code.error = 2   // 密码错误
                }else{
                    req.session.login = true;
                }
            }else if(count === administrator.length && name !== ele.name){
                code.error = 1 // 没有这个账号
            }
        });
        res.json(code)
    });
    // 退出登录  logout
    app.get('/logout', function (req, res) {
        req.session.name = undefined;
        res.redirect('/')
    });


};
