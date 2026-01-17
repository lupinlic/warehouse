import { create } from 'zustand'
import { users } from '@/mock/users.mock'
import { setUserCookie, clearUserCookie } from '@/utils/auth-cookie'
import type { Role } from '@/types/role'

type User = {
  id: number
  name: string
  role: Role
}

type AuthState = {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (username, password) => {
    const found = users.find(
      (u) => u.username === username && u.password === password
    )

    if (!found) return false

    const user = {
      id: found.id,
      name: found.name,
      role: found.role,
    }

    set({ user })
    setUserCookie(user) // ⭐ SET COOKIE CHO MIDDLEWARE

    return true
  },

  logout: () => {
    clearUserCookie()
    set({ user: null })
  },
}))
