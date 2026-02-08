import { http } from '@/lib/http'
import type {
  InOutStockReportResponse,
  StockStructureReportResponse,
  ExportAnalysisReportResponse,
} from '@/types/report'

export const reportService = {
  /**
   * GET /api/reports/inventory-summary
   * Báo cáo nhập-xuất-tồn kho
   */
  async getInventorySummary(params: {
    warehouseId: string
    fromDate?: string
    toDate?: string
  }): Promise<InOutStockReportResponse> {
    const query = new URLSearchParams()
    query.append('warehouseId', params.warehouseId)
    if (params?.fromDate) query.append('fromDate', params.fromDate)
    if (params?.toDate) query.append('toDate', params.toDate)

    const url = query.toString()
      ? `/reports/inventory-summary?${query}`
      : '/reports/inventory-summary'

    return await http<InOutStockReportResponse>(url)
  },

  /**
   * GET /api/reports/top-export-materials
   * Báo cáo vật tư xuất kho nhiều nhất
   */
  async getTopExportMaterials(params: {
    warehouseId?: string
    fromDate?: string
    toDate?: string
    limit?: number
  }): Promise<ExportAnalysisReportResponse> {
    const query = new URLSearchParams()
    if (params?.warehouseId) query.append('warehouseId', params.warehouseId)
    // default fromDate to 2025-01-01 and toDate to today when not provided
    const defaultFrom = '2025-01-01'
    const defaultTo = new Date().toISOString().slice(0, 10)
    const from = params?.fromDate || defaultFrom
    const to = params?.toDate || defaultTo
    if (from) query.append('fromDate', from)
    if (to) query.append('toDate', to)
    if (params?.limit) query.append('limit', params.limit.toString())

    const url = query.toString()
      ? `/reports/top-export-materials?${query}`
      : '/reports/top-export-materials'

    return await http<ExportAnalysisReportResponse>(url)
  },

  /**
   * GET /api/reports/inventory-structure
   * Báo cáo cơ cấu tồn kho
   */
  async getInventoryStructure(params: {
    warehouseId: string
    date?: string
  }): Promise<StockStructureReportResponse> {
    const query = new URLSearchParams()
    query.append('warehouseId', params.warehouseId)
    if (params?.date) query.append('date', params.date)

    const url = query.toString()
      ? `/reports/inventory-structure?${query}`
      : '/reports/inventory-structure'

    return await http<StockStructureReportResponse>(url)
  },

  /**
   * GET /api/reports/inventory-summary/export
   * Xuất báo cáo tồn kho (Excel/CSV)
   */
  async exportInventorySummary(params: {
    warehouseId: string
    fromDate?: string
    toDate?: string
    format?: 'xlsx' | 'csv'
  }): Promise<Blob> {
    const query = new URLSearchParams()
    query.append('warehouseId', params.warehouseId)
    if (params?.fromDate) query.append('fromDate', params.fromDate)
    if (params?.toDate) query.append('toDate', params.toDate)
    if (params?.format) query.append('format', params.format)

    const url = query.toString()
      ? `/reports/inventory-summary/export?${query}`
      : '/reports/inventory-summary/export'

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`)
    }

    return await response.blob()
  },
}

function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null
  try {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'accessToken' && value) {
        return decodeURIComponent(value)
      }
    }
    return null
  } catch (e) {
    console.error('Error reading access token:', e)
    return null
  }
}

export const reportExport = {
  /**
   * Export inventory summary as Excel
   * API returns JSON with message and data array, which is then converted to Excel
   */
  async exportInventorySummaryAsExcel(params: {
    warehouseId: string
    fromDate?: string
    toDate?: string
  }): Promise<{ success: boolean; message: string; data?: any[] }> {
    const query = new URLSearchParams()
    query.append('warehouseId', params.warehouseId)
    if (params?.fromDate) query.append('fromDate', params.fromDate)
    if (params?.toDate) query.append('toDate', params.toDate)

    const url = query.toString()
      ? `/reports/inventory-summary/export?${query}`
      : '/reports/inventory-summary/export'

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Export failed with status ${response.statusText}`)
    }

    const jsonData = await response.json()
    return jsonData
  },
}
