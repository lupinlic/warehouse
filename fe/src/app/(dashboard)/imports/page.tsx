import type { Metadata } from 'next'
import ImportView from '@/components/feature/import'

export const metadata: Metadata = {
  title: 'Nhập kho | Kế toán vật tư VNPT Yên Bái',
}

export default function ImportsPage() {
  return (
    <ImportView />
  )
}
