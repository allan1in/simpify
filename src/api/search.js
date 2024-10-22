import request from '@/api/request'

export function search(params) {
  return request({
    url: '/search',
    method: 'get',
    params
  })
}

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

export function searchPlaylists(params) {
  return request({
    url: '/search',
    method: 'get',
    params: {
      q: params.q,
      type: 'playlist',
      limit: params.limit,
      offset: params.offset
    }
  })
}

export function searchNextPage(path) {
  return request({
    url: `/search?${path}`,
    method: 'get'
  })
}
