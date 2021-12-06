import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
// import Index from '../components/Index.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import GoodsList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  // 重定向到/login
  { path:'/', redirect:'/login' },
  {
    path: '/login',
    name: 'Login',
    component: () =>
          import(/* webpackChunkName: "details" */ "../components/Login.vue"),
  },
  {
    path: '/index',
    name: 'Index',
    component: () =>
          import(/* webpackChunkName: "details" */ "../components/Index.vue"),
    // 重定向到/welcome
    redirect:'/welcome',
    children:[
      {path:'/welcome', component: () =>
      import(/* webpackChunkName: "details" */ "../components/Welcome.vue"),},
      {
        path:'/users',
        component: () =>
          import(/* webpackChunkName: "details" */ "../components/user/Users.vue"),
      },
      {
        path:'/rights',
        component: () =>
          import(/* webpackChunkName: "details" */ "../components/power/Rights.vue"),
      },
      {
        path:'/roles',
        component: () =>
          import(/* webpackChunkName: "details" */ "../components/power/Roles.vue"),
      },
      {
        path:'/categories',
        component: () =>
          import(/* webpackChunkName: "details" */ "../components/goods/Cate.vue"),
      },
      {
        path:'/params',
        component: () =>
          import(/* webpackChunkName: "details" */ "../components/goods/Params.vue"),
      },
      {
        path:'/goods',
        component: () =>
          import(/* webpackChunkName: "details" */ "../components/goods/List.vue"),
      },
      {
        path:'/goods/add',
        component: () =>
          import(/* webpackChunkName: "details" */ "../components/goods/Add.vue"),
      },
      {
        path:'/orders',
        component: () =>
          import(/* webpackChunkName: "details" */ "../components/order/Order.vue"),
      },
      {
        path:'/reports',
        component: () =>
          import(/* webpackChunkName: "details" */ "../components/report/Report.vue"),
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next)=>{
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next 函数 表示放行
  // next() 放行
  // next('/login') 强制跳转

  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})

export default router
