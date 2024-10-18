import request from './request'

export function getSeveralCategories(params) {
  return request({
    url: '/browse/categories',
    method: 'get',
    params
  })
}

export function getCategory(id, params) {
  return request({
    url: `/browse/categories/${id}`,
    method: 'get',
    params
  })
}
