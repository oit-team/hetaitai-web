import Vue from 'vue'
import axios from 'axios'
import { ApiError } from '@oit/api-error'
import { Message } from 'element-ui'
import store from '../store'
import API_STATUS from './enum/API_STATUS'
import router from '@/router'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
})

// 添加请求拦截器
axiosInstance.interceptors.request.use((config) => {
  config.headers.token = localStorage.getItem('token')
  return config
}, (error) => {
  return Promise.reject(new ApiError({ error }))
})

// 添加响应拦截器
axiosInstance.interceptors.response.use((response) => {
  if (response.data.head?.status !== API_STATUS.OK) {
    return Promise.reject(new ApiError({
      response,
      message: response.data.head.msg,
      status: response.data.head.status,
    }))
  }
  return response
}, async (error) => {
  if (error.response?.status === API_STATUS.MISSING || error.response?.status === API_STATUS.DELAYED) {
    Vue.prototype.$message({
      message: '会话超时,已注销,请重新登录',
      type: 'warning',
    })
    sessionStorage.clear()
    localStorage.clear()
    router.replace({
      path: '/login',
    })
  }
  return Promise.reject(new ApiError({ error }))
})

export function post(url, params = {}, config = {}) {
  const userData = store.state.userInfo

  params = {
    head: {
      aid: userData.id,
      cmd: config.cmd,
      ver: '1.0',
      ln: 'cn',
      mod: 'home',
      de: '2019-10-16',
      sync: 1,
      uuid: userData.brandId,
      chcode: 'ef19843298ae8f2134f',
    },
    con: params,
  }

  return axiosInstance
    .post(url, params, config)
    .then(res => res.data)
}

Vue.config.errorHandler = (err, vm, info) => {
  // 处理接口错误
  if (err instanceof ApiError) {
    // 输出提示消息
    Message.error(err.message)
  } else {
    Vue.util.warn(err, vm)
  }
}
