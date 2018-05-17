const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const cors = require('koa-cors');
const locale = require('koa-locale');
const i18n = require('koa-i18n');

//引入配置文件
const config = require('./config');

//
locale(app);
app.use(i18n(app, {
    directory: './config/locales',
    locales: ['zh-CN', 'en'], //  `zh-CN` defualtLocale, must match the locales to the filenames
    modes: [
        // 'query',                //  optional detect querystring - `/?locale=en-US`
        // 'subdomain',            //  optional detect subdomain   - `zh-CN.koajs.com`
        'cookie',               //  optional detect cookie      - `Cookie: locale=zh-TW`
    //     'header',               //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
    //     'url',                  //  optional detect url         - `/en`
    //     'tld',                  //  optional detect tld(the last domain) - `koajs.cn`
    //     function () {
    //     }           //  optional custom function (will be bound to the koa context)
    ]
}));

//日志
// const logger = require('koa-logger');
// app.use(logger());
if (config.open_log) {
    const logUtil = require('./utils/log_util');
    app.use(async (ctx, next) => {
        //响应开始时间
        const start = new Date();
        //响应间隔时间
        let ms;
        try {
            //开始进入到下一个中间件
            await next();

            ms = new Date() - start;
            //记录响应日志
            logUtil.logResponse(ctx, ms);

        } catch (error) {

            ms = new Date() - start;
            //记录异常日志
            logUtil.logError(ctx, error, ms);
        }
    });
}

const routes = require('./routes/');

// error handler
onerror(app);

//跨域
// app.use(cors());

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(require('koa-static')(__dirname + '/public'));


app.use(views(__dirname + '/views', {
    map: {html: 'ejs'},
    options: {
        static_url: function (url) {
            return config.APP_URL + url + (config.STATIC_V ? '?v=' + config.STATIC_V : '');
        }
    }
}));

// routes
app.use(routes.routes(), routes.allowedMethods());

const _locale_ = require('./config/locales/_locale_');

// 404
app.use(async (ctx, next) => {
    ctx.response.status = 404;

    await ctx.render("errors/404", _locale_(ctx));
});

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app;
