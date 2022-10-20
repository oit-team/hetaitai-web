import { post } from './index'

/**
 * 获取留言列表
 */
export function getMessageList(params) {
  return post('/appServer/integralGoods/getMessageList', params)
}

