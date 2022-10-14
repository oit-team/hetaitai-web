import { post } from './index'

/**
 * 获取培训计划列表 以及增加 编辑 删除
 */
export function getTrainList(params) {
  return post('/appServer/trainingRecord/getTrainingRecordAll', params)
}

export function addTraining(params) {
  return post('/appServer/trainingRecord/addTraining', params)
}

export function updateTraining(params) {
  return post('/appServer/trainingRecord/updateTraining', params)
}

export function getTrainingById(params) {
  return post('/appServer/trainingRecord/getTrainingById', params)
}

export function delTraining(params) {
  return post('/appServer/trainingRecord/delTraining', params)
}
export function getSysUserList(params) {
  return post('/appServer/trainingRecord/getSysUserList', params)
}

export function addTrainingUser(params) {
  return post('/appServer/trainingRecord/addTrainingUser', params)
}
export function delTrainingUser(params) {
  return post('/appServer/trainingRecord/delTrainingUser', params)
}
export function updateTrainingState(params) {
  return post('/appServer/trainingRecord/updateTrainingState', params)
}

