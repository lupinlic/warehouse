import TopExportChart from './TopExportChart'
import StockStructureChart from './StockStructureChart'
import {
  topExportMaterials,
  stockStructureData,
} from '@/utils/report-utils'
import { reportInOutStockMock } from '@/mock/report-inout-stock.mock'

const topExport = topExportMaterials(
  reportInOutStockMock,
  5
)

const stockStructure = stockStructureData(
  reportInOutStockMock,
  5
)
export default function ReportInOutChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <TopExportChart data={topExport} />
  <StockStructureChart data={stockStructure} />
</div>
  )
}


