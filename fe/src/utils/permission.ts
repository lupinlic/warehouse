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
  ],
  storekeeper: [
    'imports',
    'exports',
    'stocktakes',
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
  ],
}
