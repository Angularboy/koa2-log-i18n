const router = require('koa-router')();
const _locale_ = require('../config/locales/_locale_');

router.get('/', async (ctx, next) => {
    await ctx.render('index',  _locale_(ctx));
});

// router.prefix('/users');
//
// router.get('/', function (ctx, next) {
//     ctx.body = 'this is a users response!'
// });

module.exports = router;
