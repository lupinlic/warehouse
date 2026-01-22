export type ExportItem = {
  materialId: number
  materialName: string
  quantity: number
  price: number
}

export type ExportReceipt = {
  id: number
  code: string
  date: string
  warehouse: string
  reason: string
  createdBy: string
  total: number
  items: ExportItem[]
}

export const exportsMock: ExportReceipt[] = [
  {
    id: 1,
    code: 'PX001',
    date: '2024-10-10',
    warehouse: 'Kho trung tâm',
    reason: 'Xuất lắp đặt',
    createdBy: 'Thủ kho',
    total: 6000000,
    items: [
      {
        materialId: 2,
        materialName: 'Modem',
        quantity: 10,
        price: 500000,
      },
    ],
  },
]
