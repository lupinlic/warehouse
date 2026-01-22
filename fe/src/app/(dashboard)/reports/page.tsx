import type { Metadata } from 'next'
import ReportInOutStockView from '@/components/feature/reports'

export const metadata: Metadata = {
  title: 'Báo cáo | Kế toán vật tư VNPT Yên Bái',
}
export default function ReportPage() {
  return (
    <div>
      <ReportInOutStockView />
    </div>
  )
}
