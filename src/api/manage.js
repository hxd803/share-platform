import request from '@/utils/request'

export function index () {
  return request({
    url: '/manage/index',
    method: 'post'
  })
}
