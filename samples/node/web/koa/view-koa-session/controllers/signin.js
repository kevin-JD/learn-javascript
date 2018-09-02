// sign in:

module.exports = {
    'POST /signin': async (ctx, next) => {
        var
            email = ctx.request.body.email || '',
            password = ctx.request.body.password || '';
        if (email === 'admin@example.com' && password === '123456') {
            console.log(' => signin ok --->>>   ' + email);

            //ctx.cookies.set('koa:sess', "loginOK", null);            
            ctx.session.username = email;  //登录验证通过，设置session中的username  
            //ctx.session.user = JSON.stringify({userName:'Daming:'+Math.random(),'age':18})      

            ctx.render('signin-ok.html', {
                title: 'Sign In OK',
                name: 'Mr Node'
            });
            
        } else {
            console.log('signin failed!');
            ctx.render('signin-failed.html', {
                title: 'Sign In Failed'
            });
        }
    },

    'GET /logout': async (ctx, next) => {
        ctx.session = {};
        console.log(" do logOut ---<<<  ");//登出时，将session置为空
        ctx.response.redirect('/login');
    }
};
