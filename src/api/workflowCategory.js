import request from '@/utils/request'

export function findAllCategory () {
  return request({
    url: '/manage/workflow/category/findAll',
    method: 'post'
  })
}

export function fetchList (data) {
  return request({
    url: '/manage/workflow/category/list',
    method: 'post',
    data
  })
}

export function createCategory (data) {
  return request({
    url: '/manage/workflow/category/create',
    method: 'post',
    data
  })
}

export function updateCategory (data) {
  return request({
    url: '/manage/workflow/category/update',
    method: 'post',
    data
  })
}

export function deleteCategory (data) {
  return request({
    url: '/manage/workflow/category/delete',
    method: 'post',
    data
  })
}
