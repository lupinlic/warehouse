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
  ],
  storekeeper: [
    'imports',
    'exports',
    'stocktakes',
    'stocks',
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
    'stocks'
  ],
}
