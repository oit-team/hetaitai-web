import API_SERVICE from './enum/API_SERVICE'
import { post } from './index'

export function getOrderList(params) {
  return post('/order/orderInfo/getOrders', params)
}
