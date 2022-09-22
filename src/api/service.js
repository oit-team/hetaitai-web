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
/**
 * 根据字典项查询服务类型
 */
export function dictitemInfoAllMethod(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    cmd: 100009,
  })
}

