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

export function getNextTracks(id, path) {
  return request({
    method: 'get',
    url: `/albums/${id}/tracks?${path}`
  })
}

export function getNewReleases(params) {
  return request({
    method: 'get',
    url: `/browse/new-releases`,
    params
  })
}

export function getNextNewReleases(path) {
  return request({
    method: 'get',
    url: `/browse/new-releases?${path}`
  })
}

export function checkUserSavedAlbums(params) {
  return request({
    url: `/me/albums/contains`,
    method: 'get',
    params
  })
}

export function saveAlbums(params) {
  return request({
    url: `/me/albums`,
    method: 'put',
    params
  })
}

export function deleteUserSavedAlbums(params) {
  return request({
    url: `/me/albums`,
    method: 'delete',
    params
  })
}
