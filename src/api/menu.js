import request from '@/utils/request'

export function fetchTreeTable () {
  return request({
    url: '/manage/menu/treeTable',
    method: 'post'
  })
}

export function createMenu (data) {
  return request({
    url: '/manage/menu/create',
    method: 'post',
    data
  })
}

export function updateMenu (data) {
  return request({
    url: '/manage/menu/update',
    method: 'post',
    data
  })
}

export function deleteMenu (data) {
  return request({
    url: '/manage/menu/delete',
    method: 'post',
    data
  })
}
