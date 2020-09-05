import request from '@/utils/request'

export function fetchList (data) {
  return request({
    url: '/manage/merchant-user/list',
    method: 'post',
    data
  })
}

export function createUser (data) {
  return request({
    url: '/manage/merchant-user/create',
    method: 'post',
    data
  })
}

export function updateUser (data) {
  return request({
    url: '/manage/merchant-user/update',
    method: 'post',
    data
  })
}

export function updatePassword (data) {
  return request({
    url: '/manage/merchant-user/updatePassword',
    method: 'post',
    data
  })
}

export function getUser2Edit (data) {
  return request({
    url: '/manage/merchant-user/get2Edit',
    method: 'post',
    data
  })
}

export function enableUser (data) {
  return request({
    url: '/manage/merchant-user/enable',
    method: 'post',
    data
  })
}

export function disableUser (data) {
  return request({
    url: '/manage/merchant-user/disable',
    method: 'post',
    data
  })
}

export function deleteUser (data) {
  return request({
    url: '/manage/merchant-user/delete',
    method: 'post',
    data
  })
}

export function resetPassword (data) {
  return request({
    url: '/manage/merchant-user/resetPassword',
    method: 'post',
    data
  })
}
