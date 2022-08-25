import API_SERVICE from './enum/API_SERVICE'
import { post } from './index'

/**
 * 获取订单列表 以及修改接单人状态
 */
export function getOrderList(params) {
  return post('/order/orderInfo/getOrders', params)
}

export function getCustomerOrderById(params) {
  return post('/order/orderInfo/getCustomerOrderById', params)
}

export function getDistributionRecords(params) {
  return post('/order/orderInfo/getDistributionRecords', params)
}

export function updateDistributionState(params) {
  return post('/order/orderInfo/updateDistributionState', params)
}
