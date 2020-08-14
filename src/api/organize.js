import request from '@/utils/request'

export function fetchTree (data) {
  return request({
    url: '/manage/organize/tree',
    method: 'post',
    data
  })
}

export function lazyTree (data) {
  return request({
    url: '/manage/organize/lazyTree',
    method: 'post',
    data
  })
}

export function organizeDetail (data) {
  return request({
    url: '/manage/organize/detail',
    method: 'post',
    data
  })
}

export function createOrganize (data) {
  return request({
    url: '/manage/organize/create',
    method: 'post',
    data
  })
}

export function updateOrganize (data) {
  return request({
    url: '/manage/organize/update',
    method: 'post',
    data
  })
}

export function deleteOrganize (data) {
  return request({
    url: '/manage/organize/delete',
    method: 'post',
    data
  })
}
