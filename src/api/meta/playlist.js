import request from './request'

export function getPlaylist(id) {
  return request({
    method: 'get',
    url: `/playlists/${id}`
  })
}
