import Vue from 'vue'
import Vuex from 'vuex'
import aside from './modules/aside'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
  },
  mutations: {
    changeUserInfo(state, info) {
      state.userInfo = JSON.parse(JSON.stringify(info))
    },
  },
  actions: {
  },
  modules: {
    aside,
  },
})
