import { post } from './index'

export function login(params) {
  return post('/system/user/login', params)
}
