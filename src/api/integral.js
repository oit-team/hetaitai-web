import { post } from './index'

export function getGoodsList(params) {
  return post('/appServer/integralGoods/getGoodsList', params)
}

export function addGoods(params) {
  return post('/appServer/integralGoods/addGoodsInfo', params)
}

export function updateGoodsInfo(params) {
  return post('/appServer/integralGoods/updateGoodsInfo', params)
}

export function updateGoodsState(params) {
  return post('/appServer/integralGoods/updateGoodsState', params)
}

export function deleteGoods(params) {
  return post('/appServer/integralGoods/delGoodsInfo', params)
}

export function getGoodsExchangeRecord(params) {
  return post('/appServer/integralGoods/getGoodsExchangeRecord', params)
}
