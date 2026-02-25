import { http } from '@/lib/http'
import type { Stock, StockFormData } from '@/types/stock'

// API response type từ backend
interface StockApiResponse {
  id: string
  warehouse_id: string
  warehouse_code?: string
  warehouse_name?: string
  material_id: string
  material_code?: string
  material_name?: string
  unit?: string
  // average / unit price may be provided by the API (name may vary)
  avg_price?: number
  price?: number
  unit_price?: number
  quantity: number
  min_quantity: number
  created_at?: string
  updated_at?: string
}

// Cache cho warehouse và material lookup
let warehouseCache: Map<string, { code: string; name: string }> = new Map()
let materialCache: Map<string, { code: string; name: string }> = new Map()

// Load cache từ services khác
async function ensureCache() {
  if (warehouseCache.size === 0) {
    try {
      const { getWarehouses } = await import('./warehouses')
      const res = await getWarehouses()
      res.data.forEach((w: any) => {
        warehouseCache.set(w.id, { code: w.code, name: w.name })
      })
    } catch (err) {
      console.error('Error loading warehouse cache:', err)
    }
  }
  
  if (materialCache.size === 0) {
    try {
      const { getMaterials } = await import('./materials')
      const res = await getMaterials()
      res.data.forEach((m: any) => {
        materialCache.set(m.id, { code: m.code, name: m.name })
      })
    } catch (err) {
      console.error('Error loading material cache:', err)
    }
  }
}

// Transform API response to Stock type
async function mapApiStockToStock(apiStock: StockApiResponse): Promise<Stock> {
  await ensureCache()
  
  const warehouse = warehouseCache.get(apiStock.warehouse_id)
  const material = materialCache.get(apiStock.material_id)
  
  return {
    id: apiStock.id,
    warehouseId: apiStock.warehouse_id,
    warehouseCode: apiStock.warehouse_code || warehouse?.code || '',
    warehouseName: apiStock.warehouse_name || warehouse?.name || '',
    materialId: apiStock.material_id,
    materialCode: apiStock.material_code || material?.code || '',
    materialName: apiStock.material_name || material?.name || '',
    unit: apiStock.unit || '',
    // prefer avg_price, then price, then unit_price
    price: (apiStock as any).avg_price ?? (apiStock as any).price ?? (apiStock as any).unit_price ?? undefined,
    quantity: apiStock.quantity,
    minQuantity: apiStock.min_quantity,
    createdAt: apiStock.created_at,
    updatedAt: apiStock.updated_at,
  }
}

async function mapApiResponseList(apiData: StockApiResponse[]): Promise<Stock[]> {
  return Promise.all(apiData.map(mapApiStockToStock))
}

// Transform UI form data to API format
export function mapFormDataToApiPayload(data: StockFormData): Record<string, any> {
  return {
    warehouse_id: data.warehouseId,
    material_id: data.materialId,
    quantity: data.quantity,
    min_quantity: data.minQuantity,
  }
}

// Create new stock
export async function createStockRaw(payload: Record<string, any>) {
  console.log('createStockRaw payload:', payload)
  const apiStock = await http<StockApiResponse>('/inventories', {
    method: 'POST',
    json: payload,
  })
  return { data: await mapApiStockToStock(apiStock) }
}

// Update stock
export async function updateStockRaw(id: string, payload: Record<string, any>) {
  const apiStock = await http<StockApiResponse>(`/inventories/${id}`, {
    method: 'PATCH',
    json: payload,
  })
  return { data: await mapApiStockToStock(apiStock) }
}

// Get all stocks
export async function getStocks(params?: { page?: number; limit?: number; search?: string; warehouseId?: string; materialId?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.search) query.append('search', params.search)
  if (params?.warehouseId) query.append('warehouse_id', params.warehouseId)
  if (params?.materialId) query.append('material_id', params.materialId)

  // If both warehouseId and materialId are provided, use the search endpoint
  const path = params?.warehouseId && params?.materialId
    ? `/inventories/search?warehouse_id=${encodeURIComponent(params.warehouseId)}&material_id=${encodeURIComponent(params.materialId)}`
    : (query.toString() ? `/inventories?${query.toString()}` : '/inventories')

  const res = await http<StockApiResponse[]>(path)

  return {
    data: Array.isArray(res) ? await mapApiResponseList(res) : [],
    total: Array.isArray(res) ? res.length : 0,
  }
}

// Get single stock by ID
export async function getStock(id: string) {
  const apiStock = await http<StockApiResponse>(`/inventories/${id}`)
  return {
    data: await mapApiStockToStock(apiStock),
  }
}

// Create stock
export async function createStock(data: StockFormData) {
  const payload = mapFormDataToApiPayload(data)
  console.debug('[stocks.createStock] payload ->', payload)
  return createStockRaw(payload)
}

// Update stock
export async function updateStock(id: string, data: Partial<StockFormData>) {
  const payload = mapFormDataToApiPayload(data as StockFormData)
  console.debug('[stocks.updateStock] payload ->', payload)
  return updateStockRaw(id, payload)
}

// Delete stock
export async function deleteStock(id: string) {
  return http<{ message: string }>(`/inventories/${id}`, {
    method: 'DELETE',
  })
}
