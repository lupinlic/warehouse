/**
 * Export Receipt (Phiếu xuất kho)
 */
export interface ExportReceiptItem {
  id?: string
  materialId: string
  materialCode?: string
  materialName?: string
  quantity: number
  price?: number
}

export interface ExportReceipt {
  id: string
  warehouseId: string
  warehouseCode?: string
  warehouseName?: string
  reason?: string
  items: ExportReceiptItem[]
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED'
  createdBy?: string
  createdById?: string
  createdAt?: string
  updatedAt?: string
}

export interface ExportReceiptFormData {
  warehouseId: string
  reason?: string
  items: ExportReceiptItem[]
}

export interface ExportReceiptResponse {
  success: boolean
  data: ExportReceipt
  message?: string
}

export interface ExportReceiptListResponse {
  success: boolean
  data: ExportReceipt[]
  total?: number
  message?: string
}
