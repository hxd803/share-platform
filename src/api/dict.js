import request from '@/utils/request'

export function lazyTree (data) {
  return request({
    url: '/manage/dict/lazyTree',
    method: 'post',
    data
  })
}

export function dictDetail (data) {
  return request({
    url: '/manage/dict/detail',
    method: 'post',
    data
  })
}

export function createDict (data) {
  return request({
    url: '/manage/dict/create',
    method: 'post',
    data
  })
}

export function updateDict (data) {
  return request({
    url: '/manage/dict/update',
    method: 'post',
    data
  })
}

export function deleteDict (data) {
  return request({
    url: '/manage/dict/delete',
    method: 'post',
    data
  })
}
