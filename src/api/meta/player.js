import request from './request'

export function transferPlayback(data) {
  return request({
    method: 'put',
    url: '/me/player',
    data
  })
}

export function togglePlayback(data) {
  return request({
    method: 'put',
    url: `/me/player/play`,
    data
  })
}

export function setRepeatMode(params) {
  return request({
    method: 'put',
    url: `/me/player/repeat`,
    params
  })
}

export function togglePlaybackShuffle(params) {
  return request({
    method: 'put',
    url: `/me/player/shuffle`,
    params
  })
}

export function getPlaybackState() {
  return request({
    method: 'get',
    url: `/me/player`
  })
}

export function getAvailableDevices() {
  return request({
    method: 'get',
    url: `/me/player/devices`
  })
}
