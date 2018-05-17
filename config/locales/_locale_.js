const get_ctx = function (key, ctx) {
    return ctx.i18n.__(key);
};

module.exports = function (ctx) {
    return {
        errMsg: ctx,
        title: get_ctx('title', ctx)
    }
};