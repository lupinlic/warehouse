import { http } from '@/lib/http'
import type { Material, MaterialFormData } from '@/types/material'

// API response type từ backend
interface MaterialApiResponse {
  id: number
  code: string
  name: string
  unit: string
  description?: string
  status?: string
  created_at?: string
  updated_at?: string
}

// Transform API response to Material type
function mapApiMaterialToMaterial(apiMaterial: MaterialApiResponse): Material {
  return {
    id: apiMaterial.id,
    code: apiMaterial.code,
    name: apiMaterial.name,
    unit: apiMaterial.unit,
    quantity: 0,
    price: 0,
    description: apiMaterial.description,
    createdAt: apiMaterial.created_at,
    updatedAt: apiMaterial.updated_at,
  }
}

function mapApiResponseList(apiData: MaterialApiResponse[]): Material[] {
  return apiData.map(mapApiMaterialToMaterial)
}

// Transform UI form data to API format
export function mapFormDataToApiPayload(data: MaterialFormData): Record<string, any> {
  return {
    code: data.code,
    name: data.name,
    unit: data.unit,
    description: data.description || '',
  }
}

// Create new material
export async function createMaterialRaw(payload: Record<string, any>) {
  console.log('createMaterialRaw payload:', payload)
  const apiMaterial = await http<MaterialApiResponse>('/material', {
    method: 'POST',
    json: payload,
  })
  return { data: mapApiMaterialToMaterial(apiMaterial) }
}

// Update material
export async function updateMaterialRaw(id: string | number, payload: Record<string, any>) {
  const apiMaterial = await http<MaterialApiResponse>(`/material/${id}`, {
    method: 'PATCH',
    json: payload,
  })
  return { data: mapApiMaterialToMaterial(apiMaterial) }
}

// Get all materials
export async function getMaterials(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.search) query.append('search', params.search)

  const path = query.toString() ? `/material?${query.toString()}` : '/material'
  const res = await http<MaterialApiResponse[]>(path)

  return {
    data: Array.isArray(res) ? mapApiResponseList(res) : [],
    total: Array.isArray(res) ? res.length : 0,
  }
}

// Get single material by ID
export async function getMaterial(id: string | number) {
  const apiMaterial = await http<MaterialApiResponse>(`/material/${id}`)
  return {
    data: mapApiMaterialToMaterial(apiMaterial),
  }
}

// Create material
export async function createMaterial(data: MaterialFormData) {
  const payload = mapFormDataToApiPayload(data)
  console.debug('[materials.createMaterial] payload ->', payload)
  return createMaterialRaw(payload)
}

// Update material
export async function updateMaterial(id: string | number, data: Partial<MaterialFormData>) {
  const payload = mapFormDataToApiPayload(data as MaterialFormData)
  console.debug('[materials.updateMaterial] payload ->', payload)
  return updateMaterialRaw(id, payload)
}

// Delete material
export async function deleteMaterial(id: string | number) {
  return http<{ message: string }>(`/material/${id}`, {
    method: 'DELETE',
  })
}
