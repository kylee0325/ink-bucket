const uniID = require('uni-id')
module.exports = (options) => {
	if (options) {
		uniID.init(options)
	}
	return async function auth(ctx, next) {
		const auth = await uniID.checkToken(ctx.event.uniIdToken)
		if (auth.code) {
			throw {
				code: auth.code,
				message: auth.message
			};
		}
		ctx.auth = auth
		await next()
		ctx.body = {
			code: 0,
			message: '操作成功',
			...ctx.body
		}
	}
}
