const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async sayHi() {
		return this.service.user.user.sayHi()
	}
}
