const {
	Controller
} = require('uni-cloud-router')
module.exports = class HelloController extends Controller {
	async sayHello() {
		return this.service.hello.sayHello()
	}

}
