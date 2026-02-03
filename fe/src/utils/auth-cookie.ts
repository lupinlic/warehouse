export function setUserCookie(user: any) {
  document.cookie = `user=${encodeURIComponent(
    JSON.stringify(user)
  )}; path=/`
}

export function clearUserCookie() {
  document.cookie = 'user=; path=/; max-age=0'
}

export function setAccessTokenCookie(token: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  // store access token in cookie (HttpOnly not possible from client). Keep path=/ for app access.
  document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}`
}

export function clearAccessTokenCookie() {
  document.cookie = 'accessToken=; path=/; max-age=0'
}

export function getAccessTokenFromCookie() {
  const match = document.cookie.match('(?:^|;)\\s*accessToken=([^;]*)')
  return match ? decodeURIComponent(match[1]) : null
}
