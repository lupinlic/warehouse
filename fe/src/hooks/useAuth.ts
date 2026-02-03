import { useCallback } from 'react'
import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  const doLogin = useCallback(
    async (username: string, password: string) => {
      return await login(username, password)
    },
    [login]
  )

  return {
    user,
    login: doLogin,
    logout,
  }
}

export default useAuth
