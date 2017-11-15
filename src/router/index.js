import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Login from '../components/Login.vue'
import Todolist from '../components/Todolist.vue'

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/todolist',
      name: 'Todolist',
      component: Todolist
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
