// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import iView from 'iview'
import 'iview/'
import 'iview/dist/styles/iview.css'
import '../src/assets/css/base.css'
import 'bootstrap/dist/css/bootstrap.css'
import store from './store'
import {verifyToken} from './Utils/Tools'

Vue.use(iView)
Vue.config.productionTip = false


router.beforeEach((to, from, next) => { //路由跳转拦截
  let user = verifyToken() //解析token 验证secret 并返回用户信息
  let token = sessionStorage.getItem('demo-token');
  if (to.path === '/') { // 如果是跳转到登录页的
    if (user !== null) {
      next('/todolist') // 如果有token就转向todolist不返回登录页
    }
    next() // 否则跳转回登录页
  } else {
    if (user !== null) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      next() // 如果有token就正常转向
    } else {
      next('/') // 否则跳转回登录页
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
