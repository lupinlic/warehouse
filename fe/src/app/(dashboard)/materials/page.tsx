import PageTitle from '@/components/shared/common/PageTitle'
import MaterialsView from '@/components/feature/materials'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý vật tư | Kế toán vật tư VNPT Yên Bái',
}
export default function MaterialsPage() {
  return (
    <div>
      <MaterialsView />   
    </div>
  )
}
