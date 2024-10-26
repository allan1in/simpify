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
