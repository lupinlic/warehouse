import { useMemo } from 'react'
import { useAuthStore } from '@/store/auth.store'

export function useRole() {
  const user = useAuthStore((s) => s.user)

  const hasRole = useMemo(() => {
    return (roles: string | string[]) => {
      if (!user) return false
      const expected = Array.isArray(roles) ? roles : [roles]
      return expected.includes(user.role as unknown as string)
    }
  }, [user])

  return { user, hasRole }
}

export default useRole
