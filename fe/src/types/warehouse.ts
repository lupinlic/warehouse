/**
 * Warehouse (Kho) - Các kho hàng
 */
export interface Warehouse {
  id: number
  code: string
  name: string
  address: string
  phone?: string
  manager: string
  managerId?: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface WarehouseFormData {
  code: string
  name: string
  address: string
  phone?: string
  manager?: string
  managerId?: number
}

export interface WarehouseResponse {
  success: boolean
  data: Warehouse
  message?: string
}

export interface WarehouseListResponse {
  success: boolean
  data: Warehouse[]
  total?: number
  message?: string
}

export interface WarehouseInventory {
  warehouseId: number
  warehouseName: string
  materialId: number
  materialName: string
  quantity: number
  price: number
  totalValue: number
}
