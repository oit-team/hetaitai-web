import { post } from './index'

/**
 * 获取陪检员列表 以及增加 编辑 删除
 */
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

export function deleteEscortList(params) {
  return post('/system/user/delUser', params)
}

