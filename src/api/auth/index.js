import request from './request'

export function getToken(data) {
  return request({
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      grant_type: 'authorization_code',
      ...data
    }
  })
}

export function refreshToken(data) {
  return request({
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      grant_type: 'refresh_token',
      refresh_token: localStorage.getItem('refresh_token'),
      ...data
    }
  })
}
