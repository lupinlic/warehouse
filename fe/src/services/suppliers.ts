import { http } from '@/lib/http'
import type { Supplier, SupplierFormData } from '@/types/supplier'

// API response type từ backend
interface SupplierApiResponse {
  id: number
  code: string
  name: string
  phone: string
  email: string
  address: string
  status?: string
  created_at?: string
  updated_at?: string
}

// Transform API response to Supplier type
function mapApiSupplierToSupplier(apiSupplier: SupplierApiResponse): Supplier {
  return {
    id: apiSupplier.id,
    code: apiSupplier.code,
    name: apiSupplier.name,
    phone: apiSupplier.phone,
    email: apiSupplier.email,
    address: apiSupplier.address,
    taxId: undefined,
    bankAccount: undefined,
    isActive: apiSupplier.status !== 'INACTIVE',
    createdAt: apiSupplier.created_at,
    updatedAt: apiSupplier.updated_at,
  }
}

function mapApiResponseList(apiData: SupplierApiResponse[]): Supplier[] {
  return apiData.map(mapApiSupplierToSupplier)
}

// Transform UI form data to API format
export function mapFormDataToApiPayload(data: SupplierFormData): Record<string, any> {
  return {
    code: data.code,
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address
  }
}

// Create new supplier
export async function createSupplierRaw(payload: Record<string, any>) {
  console.log('createSupplierRaw payload:', payload)
  const apiSupplier = await http<SupplierApiResponse>('/suppliers', {
    method: 'POST',
    json: payload,
  })
  return { data: mapApiSupplierToSupplier(apiSupplier) }
}

// Update supplier
export async function updateSupplierRaw(id: string | number, payload: Record<string, any>) {
  const apiSupplier = await http<SupplierApiResponse>(`/suppliers/${id}`, {
    method: 'PATCH',
    json: payload,
  })
  return { data: mapApiSupplierToSupplier(apiSupplier) }
}

// Get all suppliers
export async function getSuppliers(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.search) query.append('search', params.search)

  const path = query.toString() ? `/suppliers?${query.toString()}` : '/suppliers'
  const res = await http<SupplierApiResponse[]>(path)

  return {
    data: Array.isArray(res) ? mapApiResponseList(res) : [],
    total: Array.isArray(res) ? res.length : 0,
  }
}

// Get single supplier by ID
export async function getSupplier(id: string | number) {
  const apiSupplier = await http<SupplierApiResponse>(`/suppliers/${id}`)
  return {
    data: mapApiSupplierToSupplier(apiSupplier),
  }
}

// Create supplier
export async function createSupplier(data: SupplierFormData) {
  const payload = mapFormDataToApiPayload(data)
  console.debug('[suppliers.createSupplier] payload ->', payload)
  return createSupplierRaw(payload)
}

// Update supplier
export async function updateSupplier(id: string | number, data: Partial<SupplierFormData>) {
  const payload = mapFormDataToApiPayload(data as SupplierFormData)
  console.debug('[suppliers.updateSupplier] payload ->', payload)
  return updateSupplierRaw(id, payload)
}

// Delete supplier
export async function deleteSupplier(id: string | number) {
  return http<{ message: string }>(`/suppliers/${id}`, {
    method: 'DELETE',
  })
}
