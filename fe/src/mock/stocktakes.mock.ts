export type StocktakeItem = {
  materialId: number
  materialName: string
  systemQty: number
  actualQty: number
}

export type StocktakeRecord = {
  id: number
  code: string
  date: string
  warehouse: string
  createdBy: string
  note?: string
  items: StocktakeItem[]
}

export const stocktakesMock: StocktakeRecord[] = [
  {
    id: 1,
    code: 'KK001',
    date: '2024-10-15',
    warehouse: 'Kho trung tâm',
    createdBy: 'Thủ kho',
    note: 'Kiểm kê định kỳ tháng 10',
    items: [
      {
        materialId: 1,
        materialName: 'Cáp quang',
        systemQty: 500,
        actualQty: 480,
      },
      {
        materialId: 2,
        materialName: 'Modem GPON',
        systemQty: 20,
        actualQty: 20,
      },
    ],
  },
]
