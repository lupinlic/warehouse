export type ReportInOutStock = {
  id: number
  materialCode: string
  materialName: string
  unit: string
  openingQty: number
  importQty: number
  exportQty: number
  closingQty: number
}

export const reportInOutStockMock: ReportInOutStock[] = [
  {
    id: 1,
    materialCode: 'VT001',
    materialName: 'Cáp quang',
    unit: 'm',
    openingQty: 1000,
    importQty: 500,
    exportQty: 700,
    closingQty: 800,
  },
  {
    id: 2,
    materialCode: 'VT002',
    materialName: 'Modem GPON',
    unit: 'cái',
    openingQty: 50,
    importQty: 20,
    exportQty: 30,
    closingQty: 40,
  },
]
