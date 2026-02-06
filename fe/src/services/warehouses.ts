import { http } from '@/lib/http'
import type { Warehouse, WarehouseFormData } from '@/types/warehouse'
import { getUsers } from './users'

// API response type từ backend
interface WarehouseApiResponse {
  id: number
  code: string
  name: string
  location: string
  status: string
  user_id?: number
  created_at?: string
  updated_at?: string
}

// Transform API response to Warehouse type
function mapApiWarehouseToWarehouse(apiWarehouse: WarehouseApiResponse): Warehouse {
  return {
    id: apiWarehouse.id,
    code: apiWarehouse.code,
    name: apiWarehouse.name,
    address: apiWarehouse.location,
    phone: undefined,
    manager: '',
    managerId: undefined,
    userId: apiWarehouse.user_id,
    isActive: apiWarehouse.status === 'ACTIVE',
    createdAt: apiWarehouse.created_at,
    updatedAt: apiWarehouse.updated_at,
  }
}

function mapApiResponseList(apiData: WarehouseApiResponse[]): Warehouse[] {
  return apiData.map(mapApiWarehouseToWarehouse)
}

// Transform UI form data to API format
export function mapFormDataToApiPayload(data: WarehouseFormData): Record<string, any> {
  console.log('mapFormDataToApiPayload managerId:', data.managerId)
  
  return {
    code: data.code,
    name: data.name,
    location: data.address,
    status: 'ACTIVE',
    user_id: data.managerId,
  }
}

// Create new warehouse
export async function createWarehouseRaw(payload: Record<string, any>) {
  console.log('createWarehouseRaw payload:', payload)
  const apiWarehouse = await http<WarehouseApiResponse>('/warehouses', {
    method: 'POST',
    json: payload,
  })
  return { data: mapApiWarehouseToWarehouse(apiWarehouse) }
}

// Update warehouse
export async function updateWarehouseRaw(id: string | number, payload: Record<string, any>) {
  const apiWarehouse = await http<WarehouseApiResponse>(`/warehouses/${id}`, {
    method: 'PATCH',
    json: payload,
  })
  return { data: mapApiWarehouseToWarehouse(apiWarehouse) }
}

// Get all warehouses
export async function getWarehouses(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.search) query.append('search', params.search)

  const path = query.toString() ? `/warehouses?${query.toString()}` : '/warehouses'
  const res = await http<WarehouseApiResponse[]>(path)

  // Fetch users to get manager names
  try {
    const usersRes = await getUsers()
    const usersMap = new Map(usersRes.data.map(user => [user.id, user.name]))
    
    const warehouses = Array.isArray(res) 
      ? res.map(warehouse => {
          const mapped = mapApiWarehouseToWarehouse(warehouse)
          if (warehouse.user_id) {
            // Match user_id (number) with user.id (string) - need to convert
            const managerName = usersMap.get(String(warehouse.user_id)) || usersMap.get(warehouse.user_id as any)
            if (managerName) {
              mapped.manager = managerName
            }
          }
          return mapped
        })
      : []

    return {
      data: warehouses,
      total: warehouses.length,
    }
  } catch (error) {
    console.error('Error fetching warehouses with managers:', error)
    return {
      data: Array.isArray(res) ? mapApiResponseList(res) : [],
      total: Array.isArray(res) ? res.length : 0,
    }
  }
}

// Get single warehouse by ID
export async function getWarehouse(id: string | number) {
  const apiWarehouse = await http<WarehouseApiResponse>(`/warehouses/${id}`)
  return {
    data: mapApiWarehouseToWarehouse(apiWarehouse),
  }
}

// Create warehouse
export async function createWarehouse(data: WarehouseFormData) {
  const payload = mapFormDataToApiPayload(data)
  console.debug('[warehouses.createWarehouse] payload ->', payload)
  return createWarehouseRaw(payload)
}

// Update warehouse
export async function updateWarehouse(id: string | number, data: Partial<WarehouseFormData>) {
  const payload = mapFormDataToApiPayload(data as WarehouseFormData)
  console.debug('[warehouses.updateWarehouse] payload ->', payload)
  return updateWarehouseRaw(id, payload)
}

// Delete warehouse
export async function deleteWarehouse(id: string | number) {
  return http<{ message: string }>(`/warehouses/${id}`, {
    method: 'DELETE',
  })
}
