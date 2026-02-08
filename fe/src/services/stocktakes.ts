import { http } from '@/lib/http'
import type { StocktakeRecord, StocktakeItem } from '@/types/stocktake'

// API response type từ backend - Stocktake
interface StocktakeApiResponse {
  id: string
  warehouse_id: string
  warehouse: {
    id: string
    code: string
    name: string
    location?: string
    status?: string
  }
  user_id?: string
  note: string
  status: 'DRAFT' | 'COMPLETED' | 'APPROVED'
  items: StocktakeItemApiResponse[]
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

interface StocktakeItemApiResponse {
  id: string
  stocktake_id: string
  material_id: string
  material: {
    id: string
    code: string
    name: string
    unit: string
    description?: string
  }
  system_quantity: number
  actual_quantity: number
  difference: number
  inventory_id?: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

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

// Cache for user data to avoid multiple requests
let userCache: Map<string, string> = new Map()

// Fetch user name by ID (with caching)
async function getUserName(userId?: string): Promise<string> {
  if (!userId) return 'System'
  
  // Check cache first
  if (userCache.has(userId)) {
    return userCache.get(userId) || 'System'
  }
  
  try {
    const { getUser } = await import('./users')
    const res = await getUser(userId)
    const userName = res.data?.name || 'System'
    userCache.set(userId, userName)
    return userName
  } catch (err) {
    console.error('Error fetching user:', err)
    return 'System'
  }
}

// Map API stocktake response to StocktakeRecord type (sync)
function mapApiStocktakeToRecord(api: StocktakeApiResponse, createdByName: string = 'System'): StocktakeRecord {
  return {
    id: api.id as unknown as number,
    code: api.id.substring(0, 8).toUpperCase(),
    date: new Date(api.created_at).toLocaleDateString('vi-VN'),
    warehouse: api.warehouse?.name || 'N/A',
    warehouseId: api.warehouse_id as unknown as number,
    createdBy: createdByName,
    note: api.note,
    status: api.status.toLowerCase() as 'draft' | 'completed' | 'approved',
    items: (api.items || []).map((item): StocktakeItem => ({
      materialId: item.material_id as unknown as number,
      materialName: item.material?.name || 'N/A',
      systemQty: item.system_quantity,
      actualQty: item.actual_quantity,
      difference: item.difference,
      status: item.difference === 0 ? 'match' : 'mismatch',
    })),
  }
}

// Async version that enriches with user name
async function mapApiStocktakeToRecordAsync(api: StocktakeApiResponse): Promise<StocktakeRecord> {
  const createdByName = await getUserName(api.user_id)
  return mapApiStocktakeToRecord(api, createdByName)
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

// Create full stocktake (single payload with items)
export async function createStocktake(payload: Record<string, any>) {
  console.log('createStocktake payload:', payload)
  const response = await http<StocktakeApiResponse>('/stocktakes', {
    method: 'POST',
    json: payload,
  })

  const enriched = await mapApiStocktakeToRecordAsync(response)
  return { data: enriched }
}

// Get all stocktakes (enriched with user names)
export async function getStocktakes(params?: {
  page?: number
  limit?: number
  warehouseId?: string
  status?: string
}) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.warehouseId) query.append('warehouse_id', params.warehouseId)
  if (params?.status) query.append('status', params.status)

  // If a warehouseId is provided, use the search endpoint which accepts warehouse filter
  const path = params?.warehouseId
    ? `/stocktakes/search?warehouse_id=${encodeURIComponent(params.warehouseId)}`
    : (query.toString() ? `/stocktakes?${query.toString()}` : '/stocktakes')

  const res = await http<StocktakeApiResponse[]>(path)

  if (!Array.isArray(res)) {
    return { data: [], total: 0 }
  }

  // Enrich with user names
  const enriched = await Promise.all(res.map(mapApiStocktakeToRecordAsync))

  return {
    data: enriched,
    total: res.length,
  }
}

// Get single stocktake by ID (enriched with user name)
export async function getStocktake(id: string) {
  const response = await http<StocktakeApiResponse>(`/stocktakes/${id}`)
  const enriched = await mapApiStocktakeToRecordAsync(response)
  return {
    data: enriched,
  }
}

// Approve stocktake (POST /stocktakes/{id}/approve)
export async function approveStocktake(id: string) {
  const response = await http<StocktakeApiResponse>(`/stocktakes/${id}/approve`, {
    method: 'POST',
  })
  const enriched = await mapApiStocktakeToRecordAsync(response)
  return {
    data: enriched,
  }
}

// Cancel stocktake (POST /stocktakes/{id}/cancel)
export async function cancelStocktake(id: string) {
  const response = await http<StocktakeApiResponse>(`/stocktakes/${id}/cancel`, {
    method: 'POST',
  })
  const enriched = await mapApiStocktakeToRecordAsync(response)
  return {
    data: enriched,
  }
}

// Delete stocktake (DELETE /stocktakes/{id})
export async function deleteStocktake(id: string) {
  return http<{ message: string }>(`/stocktakes/${id}`, {
    method: 'DELETE',
  })
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
