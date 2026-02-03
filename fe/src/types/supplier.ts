/**
 * Supplier (Nhà cung cấp) - Các nhà cung cấp vật tư
 */
export interface Supplier {
  id: number
  code: string
  name: string
  phone: string
  email: string
  address: string
  taxId?: string
  bankAccount?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface SupplierFormData {
  code: string
  name: string
  phone: string
  email: string
  address: string
  taxId?: string
  bankAccount?: string
}

export interface SupplierResponse {
  success: boolean
  data: Supplier
  message?: string
}

export interface SupplierListResponse {
  success: boolean
  data: Supplier[]
  total?: number
  message?: string
}
