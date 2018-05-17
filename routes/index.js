const router = require('koa-router')();

const lyq = require('./lyq');

router.use('/', lyq.routes(), lyq.allowedMethods());

module.exports = router;