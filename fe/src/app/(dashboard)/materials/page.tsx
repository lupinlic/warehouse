import PageTitle from '@/components/shared/common/PageTitle'
import DataTable from '@/components/shared/table/DataTable'
import Card from '@/components/shared/ui/Card'
import Table from '@/components/shared/ui/Table'
import { materials } from '@/mock/aterials.mock'
import { warehouses } from '@/mock/warehouses.mock'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý vật tư | Kế toán vật tư VNPT Yên Bái',
}
export default function MaterialsPage() {
  return (
    <div>
      <PageTitle title="Quản lý vật tư" />

      <DataTable
        columns={[
          { key: 'code', label: 'Mã VT' },
          { key: 'name', label: 'Tên vật tư' },
          { key: 'unit', label: 'Đơn vị' },
          { key: 'quantity', label: 'Số lượng' },
          {
            key: 'warehouse',
            label: 'Kho',
            render: (row) =>
              warehouses.find(w => w.id === row.warehouseId)?.name,
          },
        ]}
        data={materials}
      />
    </div>
  )
}
