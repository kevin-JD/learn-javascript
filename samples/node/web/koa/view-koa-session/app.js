const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const templating = require('./templating');
const app = new Koa();
const isProduction = process.env.NODE_ENV === 'production';

const session=require('koa-session');
app.keys = ['some secret hurr']; //cookie签名
const CONFIG = {
  key: 'koa:sess', //默认
  maxAge: 86400000,//[需要设置]
  overwrite: true,//覆盖，无效
  httpOnly: true,
  signed: true,//签名，默认true
  rolling: false,  //每次请求强制设置session
  renew: true,//快过期的时候的请求设置session[需要设置]
};

app.use(session(CONFIG, app)); //使用session后，每个request客户端会连接后会创建session:{}


// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});


//登陆拦截
app.use(async (ctx, next) => {

    //只打印非静态文件请求url时的session、cookie：
    if (!ctx.path.startsWith('/static')) {
        console.log(" print session ==> ",ctx.session) 
        //ctx.session.testname="测试"//test set session
        //console.log("ctx.session.testname: ",ctx.session.testname) //获取session

        console.log("  print cookie -->  ",ctx.cookies.get('koa:sess'))   
    }


    //通过session中是否有用户名来判断是否登录？
    if(!ctx.session.username && ctx.path !== '/login' && ctx.path !== '/signin' 
        && !ctx.path.startsWith('/static')){   
     
        ctx.response.redirect('/login');
        return;
    }


    //通过cookie是否存在session设置koa:sess的值来判断是否登录，不安全
    // if(!ctx.cookies.get('koa:sess') && ctx.path !== '/login' && ctx.path !== '/signin' 
    //     && !ctx.path.startsWith('/static')){   
     
    //     ctx.response.redirect('/login');
    //     return;
    // }

    await next();
})
 

// static file support:
if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

// add controller:
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
