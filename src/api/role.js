import request from '@/utils/request'

export function findAllRole () {
  return request({
    url: '/manage/role/findAll',
    method: 'post'
  })
}

export function fetchList (data) {
  return request({
    url: '/manage/role/list',
    method: 'post',
    data
  })
}

export function createRole (data) {
  return request({
    url: '/manage/role/create',
    method: 'post',
    data
  })
}

export function updateRole (data) {
  return request({
    url: '/manage/role/update',
    method: 'post',
    data
  })
}

export function deleteRole (data) {
  return request({
    url: '/manage/role/delete',
    method: 'post',
    data
  })
}
