import API_SERVICE from './enum/API_SERVICE'
import { post } from './index'

/**
 * 获取服务列表 以及增加 编辑 删除
 */
export function getServicesList(params) {
  return post('/goods/serviceInfo/getServices', params)
}

export function getServicesListById(params) {
  return post('/goods/serviceInfo/getServiceById', params)
}

export function updateServices(params) {
  return post('/goods/serviceInfo/updateService', params)
}

export function deleteServices(params) {
  return post('/goods/serviceInfo/deleteService ', params)
}

