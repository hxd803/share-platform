import request from '@/utils/request'

export function fetchList (data) {
  return request({
    url: '/manage/service-platform/list',
    method: 'post',
    data
  })
}

export function fetchInfo (data) {
  return request({
    url: '/manage/service-platform/get',
    method: 'post',
    data
  })
}

export function updatePlatform (data) {
  return request({
    url: '/manage/service-platform/update',
    method: 'post',
    data
  })
}
