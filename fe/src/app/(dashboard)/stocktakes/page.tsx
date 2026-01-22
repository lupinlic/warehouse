import type { Metadata } from 'next'
import StocktakesView from '@/components/feature/stocktakes'

export const metadata: Metadata = {
  title: 'Kiểm kê | Kế toán vật tư VNPT Yên Bái',
}
export default function StocktakePage() {
  return (
    <div>
      <StocktakesView />
    </div>
  )
}
