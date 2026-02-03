/**
 * Centralized Type Exports
 * Import all types from this file instead of individual type files
 */

// Auth & User
export type { User, UserFormData, LoginRequest, LoginResponse, UserResponse, UserListResponse, AuthState } from './user'

// Role
export type { Role } from './role'

// Materials
export type { Material, MaterialFormData, MaterialResponse, MaterialListResponse } from './material'

// Warehouses
export type { Warehouse, WarehouseFormData, WarehouseResponse, WarehouseListResponse, WarehouseInventory } from './warehouse'

// Suppliers
export type { Supplier, SupplierFormData, SupplierResponse, SupplierListResponse } from './supplier'

// Receipts (Import/Export)
export type {
  ImportItem,
  ImportReceipt,
  ImportFormData,
  ImportResponse,
  ImportListResponse,
  ExportItem,
  ExportReceipt,
  ExportFormData,
  ExportResponse,
  ExportListResponse,
} from './receipt'

// Stocktake
export type { StocktakeItem, StocktakeRecord, StocktakeFormData, StocktakeResponse, StocktakeListResponse, StocktakeSummary } from './stocktake'

// Reports
export type {
  ReportInOutStock,
  InOutStockReportResponse,
  StockStructureItem,
  StockStructureReport,
  StockStructureReportResponse,
  TopExportMaterial,
  ExportAnalysisReport,
  ExportAnalysisReportResponse,
  ReportFilterParams,
  ReportSummary,
} from './report'
