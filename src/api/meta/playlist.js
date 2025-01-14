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

export function checkUserSavedPlaylists(id) {
  return request({
    url: `/playlists/${id}/followers/contains`,
    method: 'get',
    params: {
      playlist_id: id
    }
  })
}

export function savePlaylists(id) {
  return request({
    url: `/playlists/${id}/followers`,
    method: 'put',
    params: {
      playlist_id: id
    }
  })
}

export function deleteUserSavedPlaylists(id) {
  return request({
    url: `/playlists/${id}/followers`,
    method: 'delete',
    params: {
      playlist_id: id
    }
  })
}

export function createNewPlaylist(id, data) {
  return request({
    url: `/users/${id}/playlists`,
    method: 'post',
    data
  })
}

export function changePlaylistDetails(id, data) {
  return request({
    url: `/playlists/${id}`,
    method: 'put',
    data
  })
}

export function updatePlaylistCover(id, data) {
  return request({
    url: `/playlists/${id}/images`,
    method: 'put',
    headers: {
      'Content-Type': 'image/jpeg'
    },
    data
  })
}

export function addItemsToPlaylist(id, data) {
  return request({
    url: `/playlists/${id}/tracks`,
    method: 'post',
    data
  })
}

export function removePlaylistItems(id, data) {
  return request({
    url: `/playlists/${id}/tracks`,
    method: 'delete',
    data
  })
}
