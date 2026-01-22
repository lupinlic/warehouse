import type { Metadata } from 'next'
import UsersView from '@/components/feature/users'

export const metadata: Metadata = {
  title: 'Quản lý tài khoản | Kế toán vật tư VNPT Yên Bái',
}
export default function UserPage() {
  return (
    <div>
      <UsersView />
    </div>
  )
}
