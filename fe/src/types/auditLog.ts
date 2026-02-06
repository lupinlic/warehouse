/**
 * AuditLog (Nhật ký thao tác) - Ghi lại các thao tác trong hệ thống
 */

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId: string
  entityName?: string
  oldValue?: string
  newValue?: string
  ipAddress?: string
  userAgent?: string
  status: 'success' | 'failed'
  description?: string
  createdAt: string
}

export interface AuditLogResponse {
  id: string
  user_id: string
  user_name: string
  action: string
  entity_type: string
  entity_id: string
  entity_name?: string
  old_value?: string
  new_value?: string
  ip_address?: string
  user_agent?: string
  status: 'success' | 'failed'
  description?: string
  created_at: string
}

export interface AuditLogListResponse {
  data: AuditLogResponse[]
  total: number
  page: number
  pageSize: number
}
