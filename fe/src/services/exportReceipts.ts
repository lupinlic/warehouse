import { http } from '@/lib/http'
import type { ExportReceipt, ExportReceiptFormData, ExportReceiptItem } from '@/types/exportReceipt'
import { getUsers } from './users'

// API response type từ backend
interface MaterialInfo {
  id: string
  code: string
  name: string
  unit?: string
  description?: string
}

interface ExportReceiptItemApiResponse {
  id?: string
  material_id: string
  quantity: number
  material?: MaterialInfo
}

interface WarehouseInfo {
  id: string
  code: string
  name: string
  location?: string
  status?: string
}

interface ExportReceiptApiResponse {
  id: string
  code?: string
  warehouse_id: string
  warehouse?: WarehouseInfo
  reason?: string
  items?: ExportReceiptItemApiResponse[]
  status: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

// Transform API response to ExportReceipt type
function mapApiItemToItem(apiItem: ExportReceiptItemApiResponse): ExportReceiptItem {
  return {
    id: apiItem.id,
    materialId: apiItem.material_id,
    materialCode: apiItem.material?.code,
    materialName: apiItem.material?.name,
    quantity: apiItem.quantity,
    price: 2,
  }
}

function mapApiReceiptToReceipt(apiReceipt: ExportReceiptApiResponse): ExportReceipt {
  const items = apiReceipt.items || []

  return {
    id: apiReceipt.id,
    warehouseId: apiReceipt.warehouse_id,
    warehouseCode: apiReceipt.warehouse?.code || '',
    warehouseName: apiReceipt.warehouse?.name || '',
    reason: apiReceipt.reason,
    items: items.map(mapApiItemToItem),
    status: apiReceipt.status as 'DRAFT' | 'COMPLETED' | 'CANCELLED',
    createdById: apiReceipt.created_by,
    createdBy: undefined,
    createdAt: apiReceipt.created_at,
    updatedAt: apiReceipt.updated_at,
  }
}

function mapApiResponseList(apiData: ExportReceiptApiResponse[]): ExportReceipt[] {
  return apiData.map(mapApiReceiptToReceipt)
}

// Material cache for enriching items with material names
let materialCache: Map<string | number, any> = new Map()

async function ensureMaterialCache() {
  if (materialCache.size === 0) {
    try {
      const { getMaterials } = await import('@/services/materials')
      const res = await getMaterials()
      const materials = res.data || []
      materials.forEach((m) => {
        materialCache.set(String(m.id), m)
      })
    } catch (err) {
      console.warn('Failed to load material cache:', err)
    }
  }
}

// Enrich items with material names from cache or API
async function enrichItemsWithMaterialNames(items: ExportReceiptItem[]): Promise<ExportReceiptItem[]> {
  await ensureMaterialCache()
  console.log('Material cache size:', materialCache.size)
  console.log('Items before enrichment:', items)
  
  return items.map((item) => {
    if (!item.materialName && item.materialId) {
      const material = materialCache.get(item.materialId)
      console.log(`Looking up material ${item.materialId}:`, material)
      if (material) {
        return {
          ...item,
          materialCode: material.code,
          materialName: material.name,
        }
      }
    }
    return item
  })
}

// Enrich export receipt with material names
export async function enrichExportReceipt(receipt: ExportReceipt): Promise<ExportReceipt> {
  const enrichedItems = await enrichItemsWithMaterialNames(receipt.items)
  console.log(`Receipt ${receipt.id} enriched items:`, enrichedItems)
  return {
    ...receipt,
    items: enrichedItems,
  }
}

// Enrich multiple export receipts with material names
async function enrichExportReceipts(receipts: ExportReceipt[]): Promise<ExportReceipt[]> {
  const enriched = await Promise.all(receipts.map(enrichExportReceipt))
  console.log('All export receipts enriched:', enriched)
  return enriched
}

// Transform UI form data to API format
export function mapFormDataToApiPayload(data: ExportReceiptFormData): Record<string, any> {
  const payload = {
    warehouse_id: data.warehouseId,
    reason: data.reason || '',
    items: data.items.map((item) => ({
      material_id: item.materialId,
      quantity: item.quantity,
      price: item.price || 2,
    })),
  }
  console.log('Export payload to send:', payload)
  return payload
}

// Create new export receipt
export async function createExportReceiptRaw(payload: Record<string, any>) {
  console.log('createExportReceiptRaw payload:', payload)
  console.log('Items in payload:', payload.items)
  try {
    const apiReceipt = await http<ExportReceiptApiResponse>('/export-receipts', {
      method: 'POST',
      json: payload,
    })
    console.log('API response:', apiReceipt)
    const receipt = mapApiReceiptToReceipt(apiReceipt)
    const enrichedReceipt = await enrichExportReceipt(receipt)
    return { data: enrichedReceipt }
  } catch (error) {
    console.error('Error creating export receipt:', error)
    throw error
  }
}

// Update export receipt
export async function updateExportReceiptRaw(id: string, payload: Record<string, any>) {
  const apiReceipt = await http<ExportReceiptApiResponse>(`/export-receipts/${id}`, {
    method: 'PATCH',
    json: payload,
  })
  const receipt = mapApiReceiptToReceipt(apiReceipt)
  const enrichedReceipt = await enrichExportReceipt(receipt)
  return { data: enrichedReceipt }
}

// Get all export receipts
export async function getExportReceipts(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.search) query.append('search', params.search)

  const path = query.toString() ? `/export-receipts?${query.toString()}` : '/export-receipts'
  const res = await http<ExportReceiptApiResponse[]>(path)

  const receipts = Array.isArray(res) ? mapApiResponseList(res) : []
  console.log('Export receipts from API:', receipts)
  
  // Fetch users to get creator names
  try {
    const usersRes = await getUsers()
    console.log('All users for export:', usersRes.data)
    const usersMap = new Map(usersRes.data.map(user => [user.id, user.name]))
    
    const receiptsWithCreators = receipts.map(receipt => {
      const userName = receipt.createdById 
        ? (usersMap.get(receipt.createdById) || '-')
        : '-'
      console.log(`Export receipt ${receipt.id}: createdById=${receipt.createdById} -> userName=${userName}`)
      return {
        ...receipt,
        createdBy: userName
      }
    })
    
    const enrichedReceipts = await enrichExportReceipts(receiptsWithCreators)
    return {
      data: enrichedReceipts,
      total: Array.isArray(res) ? res.length : 0,
    }
  } catch (error) {
    console.error('Error enriching receipts with creator names:', error)
    const enrichedReceipts = await enrichExportReceipts(receipts)
    return {
      data: enrichedReceipts,
      total: Array.isArray(res) ? res.length : 0,
    }
  }
}

// Get single export receipt by ID
export async function getExportReceipt(id: string) {
  const apiReceipt = await http<ExportReceiptApiResponse>(`/export-receipts/${id}`)
  const receipt = mapApiReceiptToReceipt(apiReceipt)
  const enrichedReceipt = await enrichExportReceipt(receipt)
  return {
    data: enrichedReceipt,
  }
}

// Cancel export receipt
export async function cancelExportReceipt(id: string) {
  const apiReceipt = await http<ExportReceiptApiResponse>(`/export-receipts/${id}/cancel`, {
    method: 'PATCH',
  })
  const receipt = mapApiReceiptToReceipt(apiReceipt)
  const enrichedReceipt = await enrichExportReceipt(receipt)
  return { data: enrichedReceipt }
}

// Complete export receipt
export async function completeExportReceipt(id: string) {
  const apiReceipt = await http<ExportReceiptApiResponse>(`/export-receipts/${id}/complete`, {
    method: 'PATCH',
  })
  const receipt = mapApiReceiptToReceipt(apiReceipt)
  const enrichedReceipt = await enrichExportReceipt(receipt)
  return { data: enrichedReceipt }
}

// Delete export receipt
export async function deleteExportReceipt(id: string) {
  return http<{ message: string }>(`/export-receipts/${id}`, {
    method: 'DELETE',
  })
}

