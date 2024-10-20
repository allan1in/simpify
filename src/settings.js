export default {
  clientId: '7a4eb047468d473c9d2c54e8dc04ecdc', // App clientId
  redirectUrl: 'http://localhost:5173/login', // App redirect URL - must be localhost URL and/or HTTPS

  baseURL: 'https://api.spotify.com/v1',

  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  scope: 'user-read-private user-read-email user-top-read'
}
