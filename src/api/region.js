import request from '@/utils/request'

export function lazyTree (data) {
  return request({
    url: '/manage/region/lazyTree',
    method: 'post',
    data
  })
}

export function regionDetail (data) {
  return request({
    url: '/manage/region/detail',
    method: 'post',
    data
  })
}

export function createRegion (data) {
  return request({
    url: '/manage/region/create',
    method: 'post',
    data
  })
}

export function updateRegion (data) {
  return request({
    url: '/manage/region/update',
    method: 'post',
    data
  })
}

export function deleteRegion (data) {
  return request({
    url: '/manage/region/delete',
    method: 'post',
    data
  })
}
