export default {
  clientId: 'd1a9c27292924038baac7e70a0ea094e', // App clientId
  redirectUrl: 'http://localhost:5173/login', // App redirect URL - must be localhost URL and/or HTTPS

  baseURL: 'https://api.spotify.com/v1',

  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  scope:
    'user-read-private user-read-email user-top-read app-remote-control streaming user-read-playback-state user-modify-playback-state user-read-currently-playing user-library-read'
}
