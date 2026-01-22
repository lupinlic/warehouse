import type { Metadata } from 'next'
import SuppliersView from '@/components/feature/suppliers'

export const metadata: Metadata = {
  title: 'Quản lý nhà cung cấp | Kế toán vật tư VNPT Yên Bái',
}
export default function SupplierPage() {
  return (
    <div>
      <SuppliersView />
    </div>
  )
}
