export type Supplier = {
  id: number
  code: string
  name: string
  phone: string
  email: string
  address: string
}

export const suppliersMock: Supplier[] = [
  {
    id: 1,
    code: 'NCC01',
    name: 'Công ty Thiết bị Viễn thông A',
    phone: '0912345678',
    email: 'contact@viettel-a.vn',
    address: 'Hà Nội',
  },
  {
    id: 2,
    code: 'NCC02',
    name: 'Công ty CNTT B',
    phone: '0987654321',
    email: 'info@cnttb.vn',
    address: 'Yên Bái',
  },
]
