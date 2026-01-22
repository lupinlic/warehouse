'use client'

import DataTable from '@/components/shared/table/DataTable'
import ReportFilter from './components/ReportFilter'
import ReportInOutChart from './components/ReportInOutStockView'
import { reportInOutStockMock } from '@/mock/report-inout-stock.mock'
import { reportColumns } from './components/columns'

export default function ReportInOutStockView() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">
        Báo cáo Nhập – Xuất – Tồn
      </h1>

      {/* Bộ lọc */}
      <ReportFilter />

      {/* Biểu đồ */}
      <ReportInOutChart  />

      {/* Bảng */}
      <DataTable
        columns={reportColumns}
        data={reportInOutStockMock}
      />
    </div>
  )
}
