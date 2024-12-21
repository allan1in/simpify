import request from './request'

export function getTrack(id) {
  return request({
    url: `/tracks/${id}`,
    method: 'get'
  })
}

export function checkUserSavedTracks(params) {
  return request({
    url: `/me/tracks/contains`,
    method: 'get',
    params
  })
}

export function saveTracks(params) {
  return request({
    url: `/me/tracks`,
    method: 'put',
    params
  })
}

export function deleteUserSavedTracks(params) {
  return request({
    url: `/me/tracks`,
    method: 'delete',
    params
  })
}

export function getRecentlyPlayedTracks(params) {
  return request({
    url: `/me/player/recently-played`,
    method: 'get',
    params
  })
}

export function getNextRecentlyPlayedTracks(path) {
  return request({
    url: `/me/player/recently-played?${path}`,
    method: 'get'
  })
}
