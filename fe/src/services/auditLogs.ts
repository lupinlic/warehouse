import { http } from '@/lib/http'
import type { AuditLog, AuditLogResponse } from '@/types/auditLog'

// Transform API response to internal format
function mapApiAuditLogToAuditLog(apiLog: AuditLogResponse): AuditLog {
  return {
    id: apiLog.id,
    createdAt: apiLog.created_at,
    updatedAt: apiLog.updated_at,
    userId: apiLog.user_id,
    action: apiLog.action,
    entityName: apiLog.entity_name,
    entityId: apiLog.entity_id,
    oldValue: apiLog.old_value,
    newValue: apiLog.new_value,
    ip: apiLog.ip,
    userAgent: apiLog.user_agent,
  }
}

export const auditLogsService = {
  // Get total count of audit logs (fetch limited amount and get total from response)
  async getTotalAuditLogsCount() {
    try {
      const searchParams = new URLSearchParams({
        limit: '10000',
        offset: '0',
      })
      const response = await http<any>(`/audit-logs?${searchParams}`)
      
      // If response has total field
      if (response && typeof response === 'object' && 'total' in response) {
        return (response as any).total
      }
      
      // Otherwise count the items returned
      const items = Array.isArray(response) ? response : response.data || []
      return items.length
    } catch (err) {
      console.error('Error fetching audit logs count:', err)
      return 0
    }
  },

  // Get recent audit logs with total count (for notifications)
  async getRecentAuditLogsWithCount(limit: number = 5) {
    try {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: '0',
      })
      const response = await http<any>(`/audit-logs?${searchParams}`)
      
      // Handle both array and object responses
      let data: AuditLogResponse[]
      if (Array.isArray(response)) {
        data = response.slice(0, limit)
      } else if (response && 'data' in response) {
        data = Array.isArray(response.data) ? response.data.slice(0, limit) : []
      } else {
        data = []
      }
      
      // Get total count
      const total = await this.getTotalAuditLogsCount()
      
      return {
        data: data.map(mapApiAuditLogToAuditLog),
        total: total,
      }
    } catch (err) {
      console.error('Error fetching recent audit logs:', err)
      return {
        data: [],
        total: 0,
      }
    }
  },

  // Get all audit logs with pagination
  async getAllAuditLogs(page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize
    const searchParams = new URLSearchParams({
      limit: pageSize.toString(),
      offset: offset.toString(),
    })
    
    try {
      const response = await http<any>(`/audit-logs?${searchParams}`)
      
      // Handle both array and object responses
      let data: AuditLogResponse[]
      if (Array.isArray(response)) {
        data = response
      } else if (response && 'data' in response) {
        data = response.data
      } else {
        data = []
      }
      
      // Get total count
      const total = await this.getTotalAuditLogsCount()
      
      return {
        data: data.map(mapApiAuditLogToAuditLog),
        total: total,
        page,
        pageSize,
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      return {
        data: [],
        total: 0,
        page,
        pageSize,
      }
    }
  },
}
