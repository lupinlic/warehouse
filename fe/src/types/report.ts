/**
 * Report Types (Báo cáo)
 */

// ============= IN/OUT STOCK REPORT =============
export interface ReportInOutStock {
  id: string | number
  materialCode: string
  materialName: string
  unit: string
  openingQty: number
  importQty: number
  exportQty: number
  closingQty: number
  price?: number
  totalValue?: number
  period?: string
}

export interface InventorySummaryData {
  materialCode: string
  materialName: string
  unit: string
  quantity: number
  value: number
}

export interface InOutStockReportResponse {
  success: boolean
  data: ReportInOutStock[] | InventorySummaryData[]
  total?: number
  totalValue?: number
  message?: string
}

// ============= STOCK STRUCTURE REPORT =============
export interface StockStructureItem {
  materialId: string
  materialCode: string
  materialName: string
  unit: string
  quantity: number
  price: number
  totalValue: number
  percentage: number
}

export interface StockStructureReport {
  warehouseId: string
  warehouseName: string
  totalItems: number
  totalQuantity: number
  totalValue: number
  items: StockStructureItem[]
}

export interface StockStructureReportResponse {
  success: boolean
  data: StockStructureReport[]
  message?: string
}

// ============= EXPORT ANALYSIS REPORT =============
export interface TopExportMaterial {
  rank: number
  materialCode: string
  materialName: string
  quantity: number
  value: number
  percentage: number
}

export interface ExportAnalysisReport {
  period: string
  totalExportValue: number
  totalExportQty: number
  topExports: TopExportMaterial[]
}

export interface ExportAnalysisReportResponse {
  success: boolean
  data: ExportAnalysisReport
  message?: string
}

// ============= GENERAL REPORT QUERY =============
export interface ReportFilterParams {
  fromDate?: string
  toDate?: string
  warehouseId?: number
  supplierId?: number
  materialId?: number
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
}

export interface ReportSummary {
  period: string
  totalImportValue: number
  totalExportValue: number
  totalInventoryValue: number
  totalItems: number
}
