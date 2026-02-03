/**
 * Material (Vật tư) - Các vật tư được quản lý trong hệ thống
 */
export interface Material {
  id: number
  code: string
  name: string
  unit: string
  quantity: number
  price: number
  category?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface MaterialFormData {
  code: string
  name: string
  unit: string
  description?: string
}

export interface MaterialResponse {
  success: boolean
  data: Material
  message?: string
}

export interface MaterialListResponse {
  success: boolean
  data: Material[]
  total?: number
  message?: string
}
