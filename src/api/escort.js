import API_SERVICE from './enum/API_SERVICE'
import { post } from './index'

export function getEscortList(params) {
  return post('/system/user/getUsers', params)
}

export function addEscortList(params) {
  return post('/system/user/addUser', params)
}

export function editEscortList(params) {
  return post('/system/user/updateUser', params)
}

export function getEscortListById(params) {
  return post('/system/user/getUserById', params)
}
