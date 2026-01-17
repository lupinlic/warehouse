
import type { Metadata } from 'next'
import ImportsView from '@/components/feature/import'

export const metadata: Metadata = {
  title: 'Nhập kho | Kế toán vật tư VNPT Yên Bái',
}

export default function ImportsPage() {
  return (
    <ImportsView />
  )
}
