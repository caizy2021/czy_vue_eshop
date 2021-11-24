import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局样式表
import '../public/css/global.css'

// 配置axios
import axios from 'axios'
// 设置axios的默认URL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器
axios.interceptors.request.use(config=>{
  // console.log(config);
  // 为请求头对象，添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 在最后必须 return config
  return config;
});
Vue.prototype.$axios=axios

// 配置element-ui
// 从element-ui中导出资源
import ElementUI from "element-ui";
// 导入element-ui的主css文件
import 'element-ui/lib/theme-chalk/index.css'
// 把ElementUI当成Vue的插件进行加载
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
