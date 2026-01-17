import PageTitle from '@/components/shared/common/PageTitle'
import DataTable from '@/components/shared/table/DataTable'
import { warehouses } from '@/mock/warehouses.mock'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý kho | Kế toán vật tư VNPT Yên Bái',
}
export default function WarePage() {
  return (
    <div>
      <PageTitle title="Danh sách kho" />

      <DataTable
        columns={[
          { key: 'code', label: 'Mã kho' },
          { key: 'name', label: 'Tên kho' },
          { key: 'address', label: 'Địa chỉ' },
        ]}
        data={warehouses}
      />
    </div>
  )
}
