import request from './request'

export function getSeveralCategories(params) {
  return request({
    url: '/browse/categories',
    method: 'get',
    params
  })
}

export function getNextSeveralCategories(path) {
  return request({
    url: `/browse/categories?${path}`,
    method: 'get'
  })
}

export function getCategory(id, params) {
  return request({
    url: `/browse/categories/${id}`,
    method: 'get',
    params
  })
}

export function getCategoryPlaylists(id, params) {
  return request({
    url: `/browse/categories/${id}/playlists`,
    method: 'get',
    params
  })
}

export function getNextCategoryPlaylists(id, path) {
  return request({
    url: `/browse/categories/${id}/playlists?${path}`,
    method: 'get'
  })
}

export function getFeaturedPlaylists(params) {
  return request({
    url: `/browse/featured-playlists`,
    method: 'get',
    params
  })
}

export function getNextFeaturedPlaylists(path) {
  return request({
    url: `/browse/featured-playlists?${path}`,
    method: 'get'
  })
}
