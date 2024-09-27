export function getCodeVerifier() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const randomValues = crypto.getRandomValues(new Uint8Array(64))
  return randomValues.reduce((acc, x) => acc + possible[x % possible.length], '')
}
