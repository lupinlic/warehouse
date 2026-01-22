import WarehousesView from '@/components/feature/warehouses'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý kho | Kế toán vật tư VNPT Yên Bái',
}
export default function WarePage() {
  return (
    <div>
      <WarehousesView />
    </div>
  )
}
