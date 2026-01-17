import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý tài khoản | Kế toán vật tư VNPT Yên Bái',
}
export default function UserPage() {
  return (
    <div>
      <h1>Quản lý vật tư</h1>
      <p>Danh sách vật tư</p>
    </div>
  )
}
