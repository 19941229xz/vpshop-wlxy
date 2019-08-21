// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
//配置mui的js  与css
import mui from '../static/mui/js/mui.min.js'
import '../static/mui/css/mui.min.css'
import '../static/mui/css/common.css'
// 引入layer弹框组建
import layer from '../static/mui/js/layer.js'
import '../static/mui/js/need/layer.css'
// 图片预览js
// import zoom from '../static/mui/js/mui.zoom.js'
// import previewimage from '../static/mui/js/mui.previewimage.js'
// 

Vue.prototype.$layer = layer

Vue.config.productionTip = false
// // 配置全局layer
// var loadTip = layer.open({
// 	type: 2,
// 	content: '加载中'
// });
// layer.close(loadTip)
import VeeValidate, {
	Validator
} from 'vee-validate';
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import VueI18n from 'vue-i18n';
Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: 'zh_CN',
})
Validator.extend('mobile', {
	messages: {
		en: field => field + '必须是11位手机号码',
	},
	validate: value => {
		return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
	}
});
Vue.use(VeeValidate, {
	// validity: true,
	aria: true,
	i18n,
	i18nRootKey: 'validation',
	dictionary: {
		zh_CN
	}
});



var loadTip = null
var loadCount = 0
// 配置axios相关属性
axios.interceptors.request.use(config => {
	// if (loadTip == null) {
	// loadTip = layer.open({
	// 	type: 2,
	// 	content: '加载中',
	// 	time: 60
	// });
	// }
	// loadCount++
	//
	let userId = Vue.prototype.$getCookie('userId')
	let routeName = router.currentRoute.name
	if (userId == null || userId == '') {
		if (routeName.indexOf('ogin') <= -1) {
			// setCookie('lastHref', window.location.href, 30 * 60)
			router.push('/loginAndReg')
		}
	}

	// config.method === 'post' ?
	// 	config.data = qs.stringify({ ...config.data
	// 	}) :
	// 	config.params = { ...config.params
	// 	};
	// config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	return config;
}, error => { //请求错误处理

	Promise.reject(error)
});

axios.interceptors.response.use(
	response => { //成功请求到数据
		// loadCount--
		// if (loadCount == 0) {
		// layer.close(loadTip)
		// }

		// //这里根据后端提供的数据进行对应的处理
		// if (response.data.result === 'TRUE') {
		//     return response.data;
		// } else {
		//     app.$vux.toast.show({  //常规错误处理
		//         type: 'warn',
		//         text: response.data.data.msg
		//     });
		// }
		return response
	},
	error => { //响应错误处理
		console.log('error');
		console.log(error);
		console.log(JSON.stringify(error));


		return Promise.reject(error)
	}
)



// axios.defaults.baseURL = 'http://47.93.252.104:8080'
axios.defaults.baseURL = 'https://www.bitcoc.top'
Vue.prototype.$http = axios

//
// mui.init({
// 	swipeBack: true //启用右滑关闭功能
// })
Vue.prototype.$mui = mui
Vue.prototype.$getCookie = function(name) {
	//console.log(name)
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	//console.log(arr)
	if (arr != null) return unescape(arr[2]);
	return null;
}
Vue.prototype.$setCookie = function(name, value) {
	//此 cookie 将被保存 1 小时
	var hour = 1;
	var exp = new Date();
	exp.setTime(exp.getTime() + hour * 60 * 60 * 1000);
	document.cookie = name + "=" + value + ";expires=" + exp.toGMTString();
}
Vue.prototype.$deleteCookie = function(name) {
	//console.log(document.cookie.length)
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = this.$getCookie(name); // 这是cookie的值
	// var adss = this.$getCookie(address);
	if (cval != null) {
		// 这里删除操作其实是将expires过期时间设置为当前时间，使cookie立即过期
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		// document.cookie = address + "=" + adss + ";expires=" + exp.toGMTString();
	}
}
Vue.prototype.$clearAllCookie = function() {
	console.log('清除所有cookie')
	var date = new Date();
	date.setTime(date.getTime() - 10000);
	var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
	// console.log("需要删除的cookie名字：" + keys);
	if (keys) {
		for (var i = keys.length; i--;)
			document.cookie = keys[i] + "=0; expire=" + date.toGMTString() + "; path=/";
	}
}

var isDev = true
Vue.prototype.$log = function(log) {
	if (isDev) {
		console.log(log)
	}
}

// 添加全局用户信息
Vue.prototype.$userInfo = {}

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>'
})
