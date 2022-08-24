import API_SERVICE from './enum/API_SERVICE'
import { post } from './index'

/**
 * 获取订单列表 以及增加 编辑 删除
 */
export function getOrderList(params) {
  return post('/order/orderInfo/getOrders', params)
}

export function getCustomerOrderById(params) {
  return post('/order/orderInfo/getCustomerOrderById', params)
}
