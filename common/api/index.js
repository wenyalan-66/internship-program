import axios from 'axios';
import qs from 'qs'

const baseUrl = "http://www.epirocchina.cn"
// const baseUrl = "http://10.86.93.80:8083"
axios.defaults.timeout = 5000
axios.defaults.baseURL = baseUrl
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// http request 拦截器
axios.interceptors.request.use(
	config => {
		// 请求拦截器即异常处理
		config.data = qs.stringify(config.data)
		const token = uni.getStorageSync('access_token')
		if (config.url !== '/rdd/sys/login' && token) {
			config.headers['X-Access-Token'] = `${token}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

//真机获取  
axios.defaults.adapter = function(config) {
	return new Promise((resolve, reject) => {
		var settle = require('axios/lib/core/settle');
		var buildURL = require('axios/lib/helpers/buildURL');
		let configData = qs.parse(config.data);
		config.headers['Content-Type'] = 'application/json;charset=UTF-8'
		// if (config.url == '/antbi/dashboard/subscribe') {
		// 	if (config.method.toUpperCase() == 'POST') {
		// 		for (let key in configData) {
		// 			configData[key] = Number(configData[key])
		// 		}
		// 	}
		// 	if (config.method.toUpperCase() == 'DELETE') {
		// 		configData = {
		// 			dashboardId: config.dashboardId
		// 		}
		// 	}
		// }
		uni.request({
			method: config.method.toUpperCase(),
			url: buildURL(baseUrl + config.url, config.params, config.paramsSerializer),
			header: config.headers,
			data: configData,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: false,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};
				// console.log(response.status)
				settle(resolve, reject, response);
			}
		})
	})
}

const showModal = (title) => {
	uni.setStorageSync('gologin', true)
	uni.setStorageSync('access_token', "")
	uni.showToast({
		title: title,
		icon: "none",
		duration: 2000,
		complete: () => {
			uni.navigateTo({
				url: '/pages/sso/login'
			})
		}
	})
}

// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
	if(!response.data) {
		showModal("网络开小差了！！")
		return
	}
	let gologin = uni.getStorageSync('gologin')
	if (!gologin) {
		switch (response.data.errorCode) {
			case 2001: //用户未登录
				showModal("用户未登录，请登录！")
				break
			case 2002:
				showModal("账号已过期，请重新登录！")
				break
			case 2009:
				showModal("账号下线，请重新登录！")
				break
		}
	}
	return response.data
}, err => {
	console.log(err)
	if (err && err.response) {
		switch (err.response.status) {
			case 400:
				console.log('错误请求')
				break
			case 401:
				console.log('未授权，请重新登录')
				break
			case 403:
				console.log('拒绝访问')
				break
			case 404:
				console.log('请求错误,未找到该资源')
				break
			case 405:
				console.log('请求方法未允许')
				break
			case 408:
				console.log('请求超时')
				break
			case 500:
				console.log('服务器端出错')
				// uni.setStorageSync('gologin', true)
				if (err.response.data.message === 'Token失效，请重新登录') {
					gotoLogin();
				}
				break
			case 501:
				console.log('网络未实现')
				break
			case 502:
				console.log('网络错误')
				break
			case 503:
				console.log('服务不可用')
				break
			case 504:
				console.log('网络超时')
				break
			case 505:
				console.log('http版本不支持该请求')
				break
			default:
				console.log(`连接错误${err.response.status}`)
		}
	} else {
		console.log(err)
		console.log('连接到服务器失败')
	}
	return Promise.resolve(err.response)
})

const gotoLogin = () => {
	uni.setStorageSync('access_token', "")
	uni.redirectTo({
		url: '/pages/sso/login'
	})
}


export const $fetch = async (url = '', data = {}, method = 'POST') => {
	const headers = {'Content-Type': 'application/json;charset=UTF-8'};
	switch (method) {
		case 'POST':
			return axios.post(url, data)
		case 'PUT':
			return axios.put(url, data, headers)
		case 'GET':
			return axios.get(url, {
				params: data
			})
		case 'DELETE':
			return axios.delete(url, {
				params: data
			})
	}
}
