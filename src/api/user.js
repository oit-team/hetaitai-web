import { post } from './index'

/**
 * 获取用户列表 以及增加 编辑 删除
 */
export function getUsers(params) {
  return post('/system/user/getAppUsers', params)
}

export function getUserById(params) {
  return post('/system/user/getUserById', params)
}

export function addUser(params) {
  return post('/system/user/addUser', params)
}

export function editUser(params) {
  return post('/system/user/updateUser', params)
}

export function delUser(params) {
  return post('/system/user/delUser', params)
}

/**
 * 获取所有陪检员的信息
 */
export function getUserList(params) {
  return post('/system/user/getUserList', params)
}
