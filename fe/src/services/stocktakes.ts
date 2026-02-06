import { http } from '@/lib/http'

// API response type từ backend
interface StockAdjustmentApiResponse {
  id: string
  warehouse_id: string
  material_id: string
  type: 'INCREASE' | 'DECREASE'
  quantity: number
  reason: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

// Transform UI form data to API format
export function mapStocktakeToApiPayload(data: {
  warehouseId: string
  materialId: string
  type: 'INCREASE' | 'DECREASE'
  quantity: number
  reason: string
}): Record<string, any> {
  return {
    warehouse_id: data.warehouseId,
    material_id: data.materialId,
    type: data.type,
    quantity: data.quantity,
    reason: data.reason,
  }
}

// Create stock adjustment
export async function createStockAdjustment(payload: Record<string, any>) {
  console.log('createStockAdjustment payload:', payload)
  const response = await http<StockAdjustmentApiResponse>('/stock-adjustments', {
    method: 'POST',
    json: payload,
  })
  return { data: response }
}

// Get all stock adjustments
export async function getStockAdjustments(params?: {
  page?: number
  limit?: number
  warehouseId?: string
  materialId?: string
}) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.warehouseId) query.append('warehouse_id', params.warehouseId)
  if (params?.materialId) query.append('material_id', params.materialId)

  const path = query.toString()
    ? `/stock-adjustments?${query.toString()}`
    : '/stock-adjustments'

  const res = await http<StockAdjustmentApiResponse[]>(path)

  return {
    data: Array.isArray(res) ? res : [],
    total: Array.isArray(res) ? res.length : 0,
  }
}

// Get single stock adjustment by ID
export async function getStockAdjustment(id: string) {
  const response = await http<StockAdjustmentApiResponse>(
    `/stock-adjustments/${id}`
  )
  return {
    data: response,
  }
}

// Delete stock adjustment
export async function deleteStockAdjustment(id: string) {
  return http<{ message: string }>(`/stock-adjustments/${id}`, {
    method: 'DELETE',
  })
}
