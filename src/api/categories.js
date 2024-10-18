import request from './request'

export function getSeveralCategories(params) {
  return request({
    url: '/browse/categories',
    method: 'get',
    params
  })
}
