// index:

module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html', {
            title: 'Welcome'
        });
    },
    'GET /login': async (ctx, next) => {
        ctx.render('login.html', {
            title: '请登录'
        });
    }
};


 
