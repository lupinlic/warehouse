import { http } from '@/lib/http'
import type { ImportReceipt, ImportReceiptFormData, ImportReceiptItem } from '@/types/importReceipt'
import { getUsers } from './users'

// API response type từ backend
interface ImportReceiptItemApiResponse {
  id?: string
  material_id: string
  material_code?: string
  material_name?: string
  quantity: number
  price: number
}

interface WarehouseInfo {
  id: string
  code: string
  name: string
  location?: string
  status?: string
}

interface SupplierInfo {
  id: string
  code: string
  name: string
  phone?: string
  email?: string
  address?: string
}

interface ImportReceiptApiResponse {
  id: string
  code?: string
  warehouse_id: string
  warehouse?: WarehouseInfo
  supplier_id: string
  supplier?: SupplierInfo
  items: ImportReceiptItemApiResponse[]
  status: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

// Transform API response to ImportReceipt type
function mapApiItemToItem(apiItem: ImportReceiptItemApiResponse): ImportReceiptItem {
  return {
    id: apiItem.id,
    materialId: apiItem.material_id,
    materialCode: apiItem.material_code,
    materialName: apiItem.material_name,
    quantity: apiItem.quantity,
    price: apiItem.price,
  }
}

function mapApiReceiptToReceipt(apiReceipt: ImportReceiptApiResponse): ImportReceipt {
  // Calculate total amount from items - handle undefined items
  const items = apiReceipt.items || []
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  return {
    id: apiReceipt.id,
    warehouseId: apiReceipt.warehouse_id,
    warehouseCode: apiReceipt.warehouse?.code || '',
    warehouseName: apiReceipt.warehouse?.name || '',
    supplierId: apiReceipt.supplier_id,
    supplierCode: apiReceipt.supplier?.code || '',
    supplierName: apiReceipt.supplier?.name || '',
    items: items.map(mapApiItemToItem),
    status: apiReceipt.status as 'DRAFT' | 'COMPLETED' | 'CANCELLED',
    totalAmount: totalAmount,
    createdById: apiReceipt.created_by,
    createdBy: undefined,
    createdAt: apiReceipt.created_at,
    updatedAt: apiReceipt.updated_at,
  }
}

function mapApiResponseList(apiData: ImportReceiptApiResponse[]): ImportReceipt[] {
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
async function enrichItemsWithMaterialNames(items: ImportReceiptItem[]): Promise<ImportReceiptItem[]> {
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

// Enrich import receipt with material names
async function enrichImportReceipt(receipt: ImportReceipt): Promise<ImportReceipt> {
  const enrichedItems = await enrichItemsWithMaterialNames(receipt.items)
  console.log(`Receipt ${receipt.id} enriched items:`, enrichedItems)
  return {
    ...receipt,
    items: enrichedItems,
  }
}

// Enrich multiple import receipts with material names
async function enrichImportReceipts(receipts: ImportReceipt[]): Promise<ImportReceipt[]> {
  const enriched = await Promise.all(receipts.map(enrichImportReceipt))
  console.log('All receipts enriched:', enriched)
  return enriched
}

// Transform UI form data to API format
export function mapFormDataToApiPayload(data: ImportReceiptFormData): Record<string, any> {
  return {
    warehouse_id: data.warehouseId,
    supplier_id: data.supplierId,
    items: data.items.map((item) => ({
      material_id: item.materialId,
      quantity: item.quantity,
      price: item.price,
    })),
  }
}

// Create new import receipt
export async function createImportReceiptRaw(payload: Record<string, any>) {
  console.log('createImportReceiptRaw payload:', payload)
  const apiReceipt = await http<ImportReceiptApiResponse>('/import-receipts', {
    method: 'POST',
    json: payload,
  })
  return { data: mapApiReceiptToReceipt(apiReceipt) }
}

// Update import receipt
export async function updateImportReceiptRaw(id: string, payload: Record<string, any>) {
  const apiReceipt = await http<ImportReceiptApiResponse>(`/import-receipts/${id}`, {
    method: 'PATCH',
    json: payload,
  })
  return { data: mapApiReceiptToReceipt(apiReceipt) }
}

// Get all import receipts
export async function getImportReceipts(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.search) query.append('search', params.search)

  const path = query.toString() ? `/import-receipts?${query.toString()}` : '/import-receipts'
  const res = await http<ImportReceiptApiResponse[]>(path)

  const receipts = Array.isArray(res) ? mapApiResponseList(res) : []
  console.log('Receipts before enrichment:', receipts)
  console.log('Receipt createdBy values:', receipts.map(r => ({ id: r.id, createdById: r.createdById })))
  
  // Fetch users to get creator names
  try {
    const usersRes = await getUsers()
    console.log('All users:', usersRes.data)
    const usersMap = new Map(usersRes.data.map(user => [user.id, user.name]))
    console.log('Users map entries:', Array.from(usersMap.entries()))
    
    const receiptsWithCreators = receipts.map(receipt => {
      const userName = receipt.createdById 
        ? (usersMap.get(receipt.createdById) || `NOT_FOUND: ${receipt.createdById}`)
        : 'NO_ID'
      console.log(`Receipt ${receipt.id}: createdById=${receipt.createdById} -> userName=${userName}`)
      return {
        ...receipt,
        createdBy: userName
      }
    })
    console.log('Receipts with creators:', receiptsWithCreators)
    
    return {
      data: await enrichImportReceipts(receiptsWithCreators),
      total: Array.isArray(res) ? res.length : 0,
    }
  } catch (error) {
    console.error('Error enriching receipts with creator names:', error)
    return {
      data: await enrichImportReceipts(receipts),
      total: Array.isArray(res) ? res.length : 0,
    }
  }
}

// Get single import receipt by ID
export async function getImportReceipt(id: string) {
  const apiReceipt = await http<ImportReceiptApiResponse>(`/import-receipts/${id}`)
  const receipt = mapApiReceiptToReceipt(apiReceipt)
  const enrichedReceipt = await enrichImportReceipt(receipt)
  return {
    data: enrichedReceipt,
  }
}

// Create import receipt
export async function createImportReceipt(data: ImportReceiptFormData) {
  const payload = mapFormDataToApiPayload(data)
  console.debug('[importReceipts.createImportReceipt] payload ->', payload)
  return createImportReceiptRaw(payload)
}

// Update import receipt
export async function updateImportReceipt(id: string, data: Partial<ImportReceiptFormData>) {
  const payload = mapFormDataToApiPayload(data as ImportReceiptFormData)
  console.debug('[importReceipts.updateImportReceipt] payload ->', payload)
  return updateImportReceiptRaw(id, payload)
}

// Cancel import receipt
export async function cancelImportReceipt(id: string) {
  const apiReceipt = await http<ImportReceiptApiResponse>(`/import-receipts/${id}/cancel`, {
    method: 'PATCH',
  })
  return { data: mapApiReceiptToReceipt(apiReceipt) }
}

// Complete import receipt
export async function completeImportReceipt(id: string) {
  const apiReceipt = await http<ImportReceiptApiResponse>(`/import-receipts/${id}/complete`, {
    method: 'PATCH',
  })
  return { data: mapApiReceiptToReceipt(apiReceipt) }
}

// Delete import receipt
export async function deleteImportReceipt(id: string) {
  return http<{ message: string }>(`/import-receipts/${id}`, {
    method: 'DELETE',
  })
}
