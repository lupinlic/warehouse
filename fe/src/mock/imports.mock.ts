export type ImportItem = {
  materialId: number
  materialName: string
  quantity: number
  price: number
}

export type ImportReceipt = {
  id: number
  code: string
  date: string
  supplier: string
  warehouse: string
  total: number
  createdBy: string
  items: ImportItem[]
}

export const importsMock: ImportReceipt[] = [
  {
    id: 1,
    code: 'PN001',
    date: '2024-10-01',
    supplier: 'Công ty Thiết bị Viễn Thông A',
    warehouse: 'Kho trung tâm',
    createdBy: 'Kế toán vật tư',
    total: 15000000,
    items: [
      {
        materialId: 1,
        materialName: 'Cáp quang',
        quantity: 500,
        price: 20000,
      },
      {
        materialId: 2,
        materialName: 'Modem GPON',
        quantity: 10,
        price: 500000,
      },
    ],
  },
  {
    id: 2,
    code: 'PN002',
    date: '2024-10-05',
    supplier: 'Công ty CNTT B',
    warehouse: 'Kho chi nhánh',
    createdBy: 'Kế toán vật tư',
    total: 8000000,
    items: [
      {
        materialId: 3,
        materialName: 'Router Wifi',
        quantity: 20,
        price: 400000,
      },
    ],
  },
]
