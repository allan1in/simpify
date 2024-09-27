export default {
  clientId: '7a4eb047468d473c9d2c54e8dc04ecdc', // your clientId
  redirectUrl: 'http://localhost:5173/login', // your redirect URL - must be localhost URL and/or HTTPS

  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  scope: 'user-read-private user-read-email app-remote-control'
}
