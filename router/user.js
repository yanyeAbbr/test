const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const user = require('../modle/users');


module.exports = function (app) {
    var data = {
        err : 0,
        name : ''
    };
    let name  = '';
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
                data.name = profile.displayName;
                return cb(null, profile);
            }
        ));
    }

    // 授权成功的回调函数以及各种限制 重定向到主页
    app.get('/auth/github/callback', passport.authenticate('github'), function (req, res) {
        req.session.name = data.name;
        res.redirect('/')
    });
    app.get('/auth/google/callback', passport.authenticate('google', {scope: ['profile']}), function (req, res) {
        req.session.name = data.name;
        res.redirect('/')
    });


    // 退出登录  logout
    app.get('/logout', function (req, res) {
        req.session.name = undefined;
        res.redirect('/')
    });

};