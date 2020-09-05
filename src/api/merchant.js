import request from '@/utils/request'

export function fetchList (data) {
  return request({
    url: '/manage/merchant/list',
    method: 'post',
    data
  })
}

export function createMerchant (data) {
  return request({
    url: '/manage/merchant/create',
    method: 'post',
    data
  })
}

export function updateMerchant (data) {
  return request({
    url: '/manage/merchant/update',
    method: 'post',
    data
  })
}

export function getMerchant (data) {
  return request({
    url: '/manage/merchant/get',
    method: 'post',
    data
  })
}

export function rateConfig (data) {
  return request({
    url: '/manage/merchant/rate-config',
    method: 'post',
    data
  })
}

export function contractList (data) {
  return request({
    url: '/manage/merchant/contract-list',
    method: 'post',
    data
  })
}

export function uploadContract (data) {
  return request({
    url: '/manage/merchant/upload-contract',
    method: 'post',
    data
  })
}
