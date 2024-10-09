import request from '@/api/request'

export function getUserProfile() {
  return request({
    url: '/me',
    method: 'get'
  })
}
