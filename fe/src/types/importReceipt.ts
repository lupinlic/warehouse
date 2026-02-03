/**
 * Import Receipt (Phiếu nhập kho)
 */
export interface ImportReceiptItem {
  id?: string
  materialId: string
  materialCode?: string
  materialName?: string
  quantity: number
  price: number
}

export interface ImportReceipt {
  id: string
  warehouseId: string
  warehouseCode?: string
  warehouseName?: string
  supplierId: string
  supplierCode?: string
  supplierName?: string
  items: ImportReceiptItem[]
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED'
  totalAmount?: number
  createdAt?: string
  updatedAt?: string
}

export interface ImportReceiptFormData {
  warehouseId: string
  supplierId: string
  items: ImportReceiptItem[]
}

export interface ImportReceiptResponse {
  success: boolean
  data: ImportReceipt
  message?: string
}

export interface ImportReceiptListResponse {
  success: boolean
  data: ImportReceipt[]
  total?: number
  message?: string
}
