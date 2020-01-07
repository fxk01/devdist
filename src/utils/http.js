import axios from 'axios';
import router from '@/router/index';
import { Message } from 'element-ui';

axios.defaults.timeout = 20000;
if(process.env.NODE_ENV === 'production' ){
	$.ajax({
		url: 'serverConfig.json',
		async: false,
		type: 'get',
		dataType: "json",
		success: function (res) {
			if (res.Base_URL) {
				axios.defaults.baseURL = res.Base_URL;
			}
		}
	});
} else {
	axios.defaults.baseURL = "/WebApiWliCrm";
}

let identify = false;

//http request 拦截器
axios.interceptors.request.use(
  	config => {
		identify = config.identify
		const token = sessionStorage.getItem('fc_token'); 
		config.headers = {
			'Authorization': token
		}
		return config;
  	},
	error => {
		return Promise.reject(error);
	}
);


//http response 拦截器
axios.interceptors.response.use(
  	response => {
		return response;
  	},
  	error => {
		//identify标识，定时请求不弹出错误信息
		if(!identify) {
			if(!error.response) {
				Message.closeAll();
				Message({
					message: '網絡不可用，請檢查你的網絡設置或等到網絡正常',
					type: 'error',
					duration: 0,
					showClose: true
				});
				return false;
			}
			if(error.response.status == 401) {
				Message.closeAll();
				Message({
					message: '登錄簽名已過期，請重新登錄',
					type: 'warning',
					showClose: true,
					onClose: function() {
						sessionStorage.removeItem('fc_username');
						router.push('/login');
					}
				});
				return false;
			} else if(error.response.status == 404) {
				Message.closeAll();
				Message({
					message: '請求接口地址出錯，請檢查',
					type: 'error',
					duration: 0,
					showClose: true
				});
				return false;
			} else if(error.response.status == 500) {
				Message.closeAll();
				Message({
					message: '服務器內部錯誤，請刷新',
					type: 'error',
					duration: 0,
					showClose: true
				});
				return false;
			}
			return Promise.reject(error)
		}
  	}
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}){
	return new Promise((resolve, reject) => {
		axios.get(url,{
			params: params
		})
		.then(res => {
			if(res.data.IsSuccess) {
				resolve(res.data);
			} else {
				Message.closeAll();
				Message({
					message: res.data.Message,
					type: 'error',
					duration: 0,
					showClose: true
				});
				reject('err');
			}
		})
		.catch(err => {
			reject(err);
		})
	})
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}){
	return new Promise((resolve, reject) => {
		axios.post(url, data)
		.then(res => {
			if(res.data.IsSuccess) {
				resolve(res.data);
			} else {
				Message.closeAll();
				Message({
					message: res.data.Message,
					type: 'error',
					duration: 0,
					showClose: true
				});
				reject('err');
			}
		},err => {
			reject(err);
		})
	})
}
