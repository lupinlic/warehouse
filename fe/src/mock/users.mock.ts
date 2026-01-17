import type { Role } from '@/types/role'

export type MockUser = {
  id: number
  username: string
  password: string
  name: string
  role: Role
}

export const users: MockUser[] = [
  {
    id: 1,
    username: 'ketoan',
    password: '123456',
    name: 'Nguyễn Văn A',
    role: 'accountant',
  },
  {
    id: 2,
    username: 'thukho',
    password: '123456',
    name: 'Trần Văn B',
    role: 'storekeeper',
  },
  {
    id: 3,
    username: 'quanly',
    password: '123456',
    name: 'Lê Văn C',
    role: 'manager',
  },
]
