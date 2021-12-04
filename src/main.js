import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局样式表
import '../public/css/global.css'

// 导入插件 vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 导入插件 VueQuillEditor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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

// 注册 vue-table-with-tree-grid
Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用的组件 VueQuillEditor
Vue.use(VueQuillEditor)

// 注册filter过滤器
Vue.filter('dateFormat', function(originVal){
  // 接收时间戳
  const dt = new Date(originVal)

  // 计算年
  const year = dt.getFullYear()
  // 计算月，加1后从数字变成字符串
  const month = (dt.getMonth() + 1 + '')
    // 使其组成两位数，缺失的部分用0填充
    .padStart(2, '0')
  // 计算日
  const day = (dt.getDate() + '')
    // 使其组成两位数，缺失的部分用0填充
    .padStart(2, '0')
  // 计算小时
  const hours = (dt.getHours() + '')
    // 使其组成两位数，缺失的部分用0填充
    .padStart(2, '0')
  // 计算分钟
  const minutes = (dt.getMinutes() + '')
    // 使其组成两位数，缺失的部分用0填充
    .padStart(2, '0')
  // 计算秒
  const seconds = (dt.getSeconds() + '')
    // 使其组成两位数，缺失的部分用0填充
    .padStart(2, '0')
  
  // 返回时间
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
