import type { Stock } from '@/types/stock'

export const stockColumns = (
  onEdit: (row: Stock) => void,
  onDelete: (row: Stock) => void
) => [
  { key: 'warehouseCode', label: 'Mã kho' },
  { key: 'warehouseName', label: 'Tên kho' },
  { key: 'materialCode', label: 'Mã vật tư' },
  { key: 'materialName', label: 'Tên vật tư' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'minQuantity', label: 'Số lượng tối thiểu' },
  // actions column removed per request
]
