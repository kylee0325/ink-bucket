import {
	request
} from '@/common/request.js'

export function getName(data) {
	return request('hello/sayHello', data)
}

export function sayHi(data) {
	return request('user/user/sayHi', data)
}
