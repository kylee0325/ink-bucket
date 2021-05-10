const {
	Service
} = require('uni-cloud-router')
module.exports = class UserService extends Service {
	sayHi() {
		return {
			data: 'Hi, Rock!'
		}
	}
}
