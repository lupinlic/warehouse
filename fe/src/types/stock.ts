/**
 * Stock (Tồn kho) - Tồn kho vật tư theo kho
 */
export interface Stock {
  id: string
  warehouseId: string
  warehouseCode: string
  warehouseName: string
  materialId: string
  materialCode: string
  materialName: string
  unit: string
  quantity: number
  minQuantity: number
  createdAt?: string
  updatedAt?: string
}

export interface StockFormData {
  warehouseId: string
  materialId: string
  quantity: number
  minQuantity: number
}

export interface StockResponse {
  success: boolean
  data: Stock
  message?: string
}

export interface StockListResponse {
  success: boolean
  data: Stock[]
  total?: number
  message?: string
}
