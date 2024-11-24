import request from './request.js'

export function getArtist(id) {
  return request({
    url: `/artists/${id}`,
    method: 'get'
  })
}

export function getSeveralArtists(params) {
  return request({
    url: `/artists`,
    method: 'get',
    params
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

export function getNextAlbums(id, path) {
  return request({
    url: `/artists/${id}/albums?${path}`,
    method: 'get'
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

export function getNextSingles(id, path) {
  return request({
    url: `/artists/${id}/albums?${path}`,
    method: 'get'
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

export function getNextAppearsOn(id, path) {
  return request({
    url: `/artists/${id}/albums?${path}`,
    method: 'get'
  })
}

export function checkUserSavedArtists(params) {
  return request({
    url: `/me/following/contains`,
    method: 'get',
    params: {
      type: 'artist',
      ids: params.ids
    }
  })
}

export function saveArtists(params) {
  return request({
    url: `/me/following`,
    method: 'put',
    params: {
      type: 'artist',
      ids: params.ids
    }
  })
}

export function deleteUserSavedArtists(params) {
  return request({
    url: `/me/following`,
    method: 'delete',
    params: {
      type: 'artist',
      ids: params.ids
    }
  })
}
