/**
 * Stocktake (Kiểm kê) - Kiểm kê tồn kho
 */

export interface StocktakeItem {
  materialId: number
  materialName: string
  systemQty: number
  actualQty: number
  difference?: number
  status?: 'match' | 'mismatch'
}

export interface StocktakeRecord {
  id: number
  code: string
  date: string
  warehouse: string
  warehouseId?: number
  createdBy: string
  createdById?: number
  note?: string
  status?: 'draft' | 'completed' | 'approved'
  items: StocktakeItem[]
  createdAt?: string
  updatedAt?: string
  approvedAt?: string
  approvedBy?: string
}

export interface StocktakeFormData {
  date: string
  warehouseId: number
  note?: string
  items: Omit<StocktakeItem, 'materialName' | 'status'>[]
}

export interface StocktakeResponse {
  success: boolean
  data: StocktakeRecord
  message?: string
}

export interface StocktakeListResponse {
  success: boolean
  data: StocktakeRecord[]
  total?: number
  message?: string
}

export interface StocktakeSummary {
  totalItems: number
  matchCount: number
  mismatchCount: number
  discrepancyRate: number
}
