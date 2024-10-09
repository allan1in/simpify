import request from '@/api/request'

export function searchTracks(params) {
  return request({
    url: '/search',
    method: 'get',
    params: {
      q: params.q,
      type: 'track',
      limit: params.limit,
      offset: params.offset
    }
  })
}

export function searchArtists(params) {
  return request({
    url: '/search',
    method: 'get',
    params: {
      q: params.q,
      type: 'artist',
      limit: params.limit,
      offset: params.offset
    }
  })
}

export function searchAlbums(params) {
  return request({
    url: '/search',
    method: 'get',
    params: {
      q: params.q,
      type: 'album',
      limit: params.limit,
      offset: params.offset
    }
  })
}
