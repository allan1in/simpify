import request from './request'

export function getPlaylist(id) {
  return request({
    method: 'get',
    url: `/playlists/${id}`
  })
}

export function getPlaylistTracks(id, params) {
  return request({
    method: 'get',
    url: `/playlists/${id}/tracks`,
    params
  })
}

export function getNextPlaylistTracks(id, path) {
  return request({
    method: 'get',
    url: `/playlists/${id}/tracks?${path}`
  })
}
