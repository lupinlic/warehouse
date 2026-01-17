export function setUserCookie(user: any) {
  document.cookie = `user=${encodeURIComponent(
    JSON.stringify(user)
  )}; path=/`
}

export function clearUserCookie() {
  document.cookie = 'user=; path=/; max-age=0'
}
