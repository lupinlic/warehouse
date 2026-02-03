import { create } from 'zustand'
import { setUserCookie, clearUserCookie, setAccessTokenCookie, clearAccessTokenCookie } from '@/utils/auth-cookie'
import { http } from '@/lib/http'
import type { Role } from '@/types/role'

// Map server roles to app role types
function mapServerRole(serverRole: string): Role {
  const roleMap: Record<string, Role> = {
    'QUAN_LY': 'manager',
    'KE_TOAN': 'accountant',
    'THU_KHO': 'storekeeper',
    'manager': 'manager',
    'accountant': 'accountant',
    'storekeeper': 'storekeeper',
  }
  return roleMap[serverRole] ?? ('accountant' as Role)
}

type User = {
  id: string
  name: string
  role: Role
}

type AuthState = {
  user: User | null
  // login returns { success, message? }
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (email, password) => {
    try {
      console.debug('[auth] POST /auth/login', { email })
      const res = await http<any>('/auth/login', {
        method: 'POST',
        json: { email, password },
      })

      console.debug('[auth] login response', res)

      const accessToken = res.accessToken || res.token || null
      if (!accessToken) return { success: false, message: 'No access token returned' }

      // Extract from new response format: { user: { id, email, full_name, roles: [ROLE] } }
      const rawRole = res.user?.roles?.[0] || res.user?.role || res.role || ''
      const role = mapServerRole(rawRole)
      const id = res.user?.id ?? res.id ?? ''
      const name = res.user?.full_name ?? res.user?.name ?? email

      const user: User = {
        id: typeof id === 'string' ? id : id.toString(),
        name,
        role,
      }

      set({ user })
      setUserCookie(user) // for middleware or SSR checks
      setAccessTokenCookie(accessToken)

      return { success: true }
    } catch (err: any) {
      // http throws { status, message, data }
      const message = err?.data?.message || err?.message || 'Request failed'
      return { success: false, message }
    }
  },

  logout: () => {
    clearUserCookie()
    clearAccessTokenCookie()
    set({ user: null })
  },
}))
