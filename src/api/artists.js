import request from './request.js'

export function getArtist(id) {
  return request({
    url: `/artists/${id}`,
    method: 'get'
  })
}

export function getTopTracks(id) {
  return request({
    url: `/artists/${id}/top-tracks`,
    method: 'get'
  })
}

export function getAlbums(id, params) {
  return request({
    url: `/artists/${id}/albums`,
    method: 'get',
    params: {
      include_groups: 'album',
      limit: params.limit,
      offset: params.offset
    }
  })
}

export function getSingles(id, params) {
  return request({
    url: `/artists/${id}/albums`,
    method: 'get',
    params: {
      include_groups: 'single',
      limit: params.limit,
      offset: params.offset
    }
  })
}

export function getAppearsOn(id, params) {
  return request({
    url: `/artists/${id}/albums`,
    method: 'get',
    params: {
      include_groups: 'appears_on',
      limit: params.limit,
      offset: params.offset
    }
  })
}

export function getCompilations(id, params) {
  return request({
    url: `/artists/${id}/albums`,
    method: 'get',
    params: {
      include_groups: 'compilations',
      limit: params.limit,
      offset: params.offset
    }
  })
}
