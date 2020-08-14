import request from '@/utils/request'

export function getCaptchaImg () {
  return request({
    url: '/manage/captcha/img',
    method: 'post'
  })
}

export function login (data) {
  return request({
    url: '/manage/user/login',
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: '/manage/user/logout',
    method: 'post'
  })
}

export function getInfo () {
  return request({
    url: '/manage/user/getInfo',
    method: 'post'
  })
}

export function fetchList (data) {
  return request({
    url: '/manage/user/list',
    method: 'post',
    data
  })
}

export function createUser (data) {
  return request({
    url: '/manage/user/create',
    method: 'post',
    data
  })
}

export function updateUser (data) {
  return request({
    url: '/manage/user/update',
    method: 'post',
    data
  })
}

export function updatePassword (data) {
  return request({
    url: '/manage/user/updatePassword',
    method: 'post',
    data
  })
}

export function getUser2Edit (data) {
  return request({
    url: '/manage/user/get2Edit',
    method: 'post',
    data
  })
}

export function enableUser (data) {
  return request({
    url: '/manage/user/enable',
    method: 'post',
    data
  })
}

export function disableUser (data) {
  return request({
    url: '/manage/user/disable',
    method: 'post',
    data
  })
}

export function deleteUser (data) {
  return request({
    url: '/manage/user/delete',
    method: 'post',
    data
  })
}
