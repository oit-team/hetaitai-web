import API_SERVICE from './enum/API_SERVICE'
import { post } from './index'

export function getUsers(params) {
  return post[API_SERVICE.SYSTEM]('/user/getUsers', params)
}
