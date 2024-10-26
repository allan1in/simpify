import request from './request'

export function getPlayerState() {
  return request({
    method: 'get',
    url: `/me/player`
  })
}
