import request from '@/utils/request'

export function fetchList (data) {
  return request({
    url: '/manage/workflow/model/list',
    method: 'post',
    data
  })
}

export function createModel (data) {
  return request({
    url: '/manage/workflow/model/create',
    method: 'post',
    data
  })
}

export function deleteModel (data) {
  return request({
    url: '/manage/workflow/model/delete',
    method: 'post',
    data
  })
}

export function updateModel (data) {
  return request({
    url: '/manage/workflow/model/update',
    method: 'post',
    data
  })
}

export function getBpmnXml (data) {
  return request({
    url: '/manage/workflow/model/getBpmnXml',
    method: 'post',
    data
  })
}

export function saveBpmnXml (data) {
  return request({
    url: '/manage/workflow/model/saveBpmnXml',
    method: 'post',
    data
  })
}
