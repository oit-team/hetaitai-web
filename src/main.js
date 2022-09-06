import Vue from 'vue'
import { TablePage } from '@oit/element-ui-extend'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/components/element-ui'

import 'windi.css'

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  document.title = '禾太太'
  if (to.name) {
    next()
  } else {
    return
  }
  if (to.meta.requiresAuth) {
    if (localStorage.getItem('userId')) {
      next()
    } else {
      Message('暂无权限，请登录后再试')
      next({
        path: '/login',
      })
    }
  }
  next()
})

Vue.use(TablePage, {
  setFields() {
    if (sessionStorage.headTitString) {
      return JSON.parse(sessionStorage.headTitString)
    }
  },
})

const [routerPush, routerReplace] = [VueRouter.prototype.push, VueRouter.prototype.replace]
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
VueRouter.prototype.replace = function replace(location) {
  return routerReplace.call(this, location).catch(error => error)
}

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
