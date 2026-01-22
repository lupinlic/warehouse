export type Warehouse = {
  id: number
  code: string
  name: string
  address: string
  manager: string
}

export const warehousesMock: Warehouse[] = [
  {
    id: 1,
    code: 'KHO01',
    name: 'Kho trung tâm',
    address: 'TP Yên Bái',
    manager: 'Nguyễn Văn A',
  },
  {
    id: 2,
    code: 'KHO02',
    name: 'Kho chi nhánh',
    address: 'Huyện Văn Yên',
    manager: 'Trần Văn B',
  },
]
