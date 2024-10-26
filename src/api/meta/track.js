import request from './request'

export function getTrack(id) {
  return request({
    url: `/tracks/${id}`,
    method: 'get'
  })
}
