export type Material = {
  id: number
  code: string
  name: string
  unit: string
  quantity: number     
  price: number          
}

export const materialsMock: Material[] = [
  {
    id: 1,
    code: 'VT001',
    name: 'Cáp quang',
    unit: 'Cuộn',
    quantity: 120,
    price: 20000,
  },
  {
    id: 2,
    code: 'VT002',
    name: 'Modem',
    unit: 'Cái',
    quantity: 45,
    price: 500000,
  },
]
