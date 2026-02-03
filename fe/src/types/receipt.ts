/**
 * Import & Export Receipts (Phiếu nhập - xuất)
 */

// ============= IMPORT TYPES =============
export interface ImportItem {
  materialId: number
  materialName: string
  quantity: number
  price: number
  total?: number
}

export interface ImportReceipt {
  id: number
  code: string
  date: string
  supplier: string
  supplierId?: number
  warehouse: string
  warehouseId?: number
  total: number
  createdBy: string
  createdById?: number
  status?: 'draft' | 'confirmed' | 'cancelled'
  note?: string
  items: ImportItem[]
  createdAt?: string
  updatedAt?: string
}

export interface ImportFormData {
  code?: string
  date: string
  supplierId: number
  warehouseId: number
  note?: string
  items: Omit<ImportItem, 'materialName'>[]
}

export interface ImportResponse {
  success: boolean
  data: ImportReceipt
  message?: string
}

export interface ImportListResponse {
  success: boolean
  data: ImportReceipt[]
  total?: number
  message?: string
}

// ============= EXPORT TYPES =============
export interface ExportItem {
  materialId: number
  materialName: string
  quantity: number
  price: number
  total?: number
}

export interface ExportReceipt {
  id: number
  code: string
  date: string
  warehouse: string
  warehouseId?: number
  reason: string
  createdBy: string
  createdById?: number
  total: number
  status?: 'draft' | 'confirmed' | 'cancelled'
  note?: string
  items: ExportItem[]
  createdAt?: string
  updatedAt?: string
}

export interface ExportFormData {
  code?: string
  date: string
  warehouseId: number
  reason: string
  note?: string
  items: Omit<ExportItem, 'materialName'>[]
}

export interface ExportResponse {
  success: boolean
  data: ExportReceipt
  message?: string
}

export interface ExportListResponse {
  success: boolean
  data: ExportReceipt[]
  total?: number
  message?: string
}
