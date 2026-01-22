import type { Metadata } from 'next'
import ExportsView from '@/components/feature/export'

export const metadata: Metadata = {
  title: 'Xuất kho | Kế toán vật tư VNPT Yên Bái',
}
export default function ExportPage() {
  return (
    <div>
      <ExportsView />
    </div>
  )
}
