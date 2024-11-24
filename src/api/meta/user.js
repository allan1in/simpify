import request from './request'

export function getCurrentUserProfile() {
  return request({
    url: '/me',
    method: 'get'
  })
}

export function getUserProfile(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

export function getUserPlaylists(id, params) {
  return request({
    url: `/users/${id}/playlists`,
    method: 'get',
    params
  })
}

export function getNextUserPlaylists(id, path) {
  return request({
    url: `/users/${id}/playlists?${path}`,
    method: 'get'
  })
}

export function getUserTopArtists(params) {
  return request({
    url: `/me/top/artists`,
    method: 'get',
    params
  })
}

export function getUserTopSongs(params) {
  return request({
    url: `/me/top/tracks`,
    method: 'get',
    params
  })
}

export function getUserlikedSongs(params) {
  return request({
    url: `/me/tracks`,
    method: 'get',
    params
  })
}

export function getNextUserlikedSongs(path) {
  return request({
    url: `/me/tracks?${path}`,
    method: 'get'
  })
}

export function getCurrentUserPlaylists(params) {
  return request({
    url: `/me/playlists`,
    method: 'get',
    params
  })
}

export function getNextCurrentUserPlaylists(path) {
  return request({
    url: `/me/playlists?${path}`,
    method: 'get'
  })
}

export function getCurrentUserAlbums(params) {
  return request({
    url: `/me/albums`,
    method: 'get',
    params
  })
}

export function getNextCurrentUserAlbums(path) {
  return request({
    url: `/me/albums?${path}`,
    method: 'get'
  })
}

export function getCurrentUserArtists(params) {
  return request({
    url: `/me/following`,
    method: 'get',
    params: {
      type: 'artist',
      limit: params.limit
    }
  })
}

export function getNextCurrentUserArtists(path) {
  return request({
    url: `/me/following?${path}`,
    method: 'get'
  })
}
