/**
 * AuditLog (Nhật ký thao tác) - Ghi lại các thao tác trong hệ thống
 */

// API response format từ backend
export interface AuditLogResponse {
  id: string
  created_at: string
  updated_at: string
  deleted_at: null | string
  user_id: string
  action: string
  entity_name: string
  entity_id: string
  old_value?: Record<string, any> | null
  new_value?: Record<string, any> | null
  ip?: string | null
  user_agent?: string | null
}

// Transformed internal format
export interface AuditLog {
  id: string
  createdAt: string
  updatedAt: string
  userId: string
  action: string
  entityName: string
  entityId: string
  oldValue?: Record<string, any> | null
  newValue?: Record<string, any> | null
  ip?: string | null
  userAgent?: string | null
}

export interface AuditLogListResponse {
  data: AuditLogResponse[]
  total?: number
  page?: number
  pageSize?: number
}
