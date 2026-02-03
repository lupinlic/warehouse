import { http } from '@/lib/http'
import type { User, UserFormData, UserListResponse, UserApiResponse } from '@/types/user'

// Transform API response to User type
function mapApiUserToUser(apiUser: UserApiResponse): User {
  return {
    id: apiUser.id,
    username: apiUser.user_name,
    name: apiUser.full_name,
    email: apiUser.email,
    phone: apiUser.phone,
    role: (apiUser.roles?.[0]?.name?.toLowerCase() || 'accountant') as any,
    status: apiUser.status,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  }
}

function mapApiResponseList(apiData: UserApiResponse[]): User[] {
  return apiData.map(mapApiUserToUser)
}

// Transform UI form data to API format
export function mapFormDataToApiPayload(data: UserFormData): Record<string, any> {
  const payload: Record<string, any> = {
    user_name: data.username,
    full_name: data.name,
    email: data.email,
    status: data.status || 'ACTIVE',
    roles: [mapRoleToApiRole(data.role)],
  }

  if (data.password) payload.password = data.password

  return payload
}

// Post a raw payload to /users (use when you want to control exact fields)
export async function createUserRaw(payload: Record<string, any>) {
    console.log('createUserRaw payload:', payload)
  const apiUser = await http<UserApiResponse>('/users', {
    method: 'POST',
    json: payload,
  })
  return { data: mapApiUserToUser(apiUser) }
}

export async function updateUserRaw(id: string | number, payload: Record<string, any>) {
  const apiUser = await http<UserApiResponse>(`/users/${id}`, {
    method: 'PATCH',
    json: payload,
  })
  return { data: mapApiUserToUser(apiUser) }
}

// Map UI role to API role
function mapRoleToApiRole(role: string): string {
  const roleMap: Record<string, string> = {
    accountant: 'KE_TOAN',
    storekeeper: 'THU_KHO',
    manager: 'QUAN_LY',
  }
  return roleMap[role] || 'KE_TOAN'
}

// Get all users
export async function getUsers(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.search) query.append('search', params.search)

  const path = query.toString() ? `/users?${query.toString()}` : '/users'
  const res = await http<UserApiResponse[]>(path)
  
  return {
    data: Array.isArray(res) ? mapApiResponseList(res) : [],
    total: Array.isArray(res) ? res.length : 0,
  }
}

// Get single user by ID
export async function getUser(id: string | number) {
  const apiUser = await http<UserApiResponse>(`/users/${id}`)
  return {
    data: mapApiUserToUser(apiUser),
  }
}

// Create new user
export async function createUser(data: UserFormData) {
  const payload = mapFormDataToApiPayload(data)
  console.debug('[users.createUser] payload ->', payload)
  const apiUser = await http<UserApiResponse>('/users', {
    method: 'POST',
    json: payload,
  })
  return {
    data: mapApiUserToUser(apiUser),
  }
}

// Update user
export async function updateUser(id: string | number, data: Partial<UserFormData>) {
  const payload = mapFormDataToApiPayload(data as UserFormData)
  console.debug('[users.updateUser] payload ->', payload)
  const apiUser = await http<UserApiResponse>(`/users/${id}`, {
    method: 'PATCH',
    json: payload,
  })
  return {
    data: mapApiUserToUser(apiUser),
  }
}

// Delete user
export async function deleteUser(id: string | number) {
  return http<{ message: string }>(`/users/${id}`, {
    method: 'DELETE',
  })
}

// Change password
export async function changePassword(id: string | number, data: { oldPassword: string; newPassword: string }) {
  return http<{ message: string }>(`/users/${id}/change-password`, {
    method: 'POST',
    json: data,
  })
}
