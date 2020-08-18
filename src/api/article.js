import request from '@/utils/request'

export function fetchList (data) {
  return request({
    url: '/manage/article/list',
    method: 'post',
    data
  })
}

export function createArticle (data) {
  return request({
    url: '/manage/article/create',
    method: 'post',
    data
  })
}

export function updateArticle (data) {
  return request({
    url: '/manage/article/update',
    method: 'post',
    data
  })
}

export function deleteArticle (data) {
  return request({
    url: '/manage/article/delete',
    method: 'post',
    data
  })
}
