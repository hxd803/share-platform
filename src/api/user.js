import request from '@/utils/request'

export function getCaptchaImg() {
  return request({
    url: '/auth/captcha/img',
    method: 'post'
  })
}

export function login(param = {}) {
  return request.post("/auth/login", param);
}

export function logout() {
  return request({
    url: '/auth/user/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/auth/user/getInfo',
    method: 'post'
  })
}

export function fetchList(data) {
  return request({
    url: '/auth/user/list',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/auth/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/auth/user/update',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/auth/user/updatePassword',
    method: 'post',
    data
  })
}

export function getUser2Edit(data) {
  return request({
    url: '/auth/user/get2Edit',
    method: 'post',
    data
  })
}

export function enableUser(data) {
  return request({
    url: '/auth/user/enable',
    method: 'post',
    data
  })
}

export function disableUser(data) {
  return request({
    url: '/auth/user/disable',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/manage/user/delete',
    method: 'post',
    data
  })
}
