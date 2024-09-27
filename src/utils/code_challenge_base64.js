export async function getCodeChanllenge(code_verifier) {
  const data = new TextEncoder().encode(code_verifier)
  const hashed = await crypto.subtle.digest('SHA-256', data)

  return btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}
