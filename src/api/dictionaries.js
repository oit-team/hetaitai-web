import { post } from './index'

/**
 * 根据字典项查询服务内容
 */
export function dictitemServiceInfo(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    cmd: 100009,
  })
}
