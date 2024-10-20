import request from './request'

export function getAlbum(id) {
  return request({
    method: 'get',
    url: `/albums/${id}`
  })
}

export function getTracks(id, params) {
  return request({
    method: 'get',
    url: `/albums/${id}/tracks`,
    params
  })
}

export function getNewReleases(params) {
  return request({
    method: 'get',
    url: `/browse/new-releases`,
    params
  })
}
