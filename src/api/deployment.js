import request from '@/utils/request'

export function fetchList (data) {
  return request({
    url: '/manage/workflow/deployment/list',
    method: 'post',
    data
  })
}

export function createDeployment (data) {
  return request({
    url: '/manage/workflow/deployment/create',
    method: 'post',
    data
  })
}

// export function deleteModel (data) {
//   return request({
//     url: '/manage/workflow/model/delete',
//     method: 'post',
//     data: qs.stringify(data, { indices: false })
//   })
// }
//
// export function updateModel (data) {
//   return request({
//     url: '/manage/workflow/model/update',
//     method: 'post',
//     data: qs.stringify(data, { indices: false })
//   })
// }
//
// export function getBpmnXml (data) {
//   return request({
//     url: '/manage/workflow/model/getBpmnXml',
//     method: 'post',
//     data: qs.stringify(data, { indices: false })
//   })
// }
//
// export function saveBpmnXml (data) {
//   return request({
//     url: '/manage/workflow/model/saveBpmnXml',
//     method: 'post',
//     data: qs.stringify(data, { indices: false })
//   })
// }
