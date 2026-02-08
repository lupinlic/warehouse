import type { Role } from '@/types/role'

export const PERMISSIONS: Record<Role, string[]> = {
  accountant: [
    'materials',
    'warehouses',
    'suppliers',
    'imports',
    'exports',
    'stocktakes',
    'reports',
    'stocks',
    'journalEntries',
    'systemLogs',
    'dashboard'
  ],
  storekeeper: [
    'imports',
    'exports',
    'stocktakes',
    'stocks',
    'dashboard',
    'systemLogs'
  ],
  manager: [
    'materials',
    'warehouses',
    'suppliers',
    'imports',
    'exports',
    'stocktakes',
    'reports',
    'users',
    'stocks',
    'journalEntries',
    'systemLogs',
    'dashboard'
  ],
}
