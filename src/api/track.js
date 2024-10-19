import request from '@/api/request'

export function getTrack(id) {
  return request({
    url: `/tracks/${id}`,
    method: 'get'
  })
}
