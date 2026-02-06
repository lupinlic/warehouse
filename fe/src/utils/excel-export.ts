import * as XLSX from 'xlsx'

export interface ExportItem {
  materialId?: string
  materialCode?: string
  materialName?: string
  unit?: string
  openingStock?: string | number
  importQuantity?: string | number
  exportQuantity?: string | number
  closingStock?: string | number
  [key: string]: any
}

/**
 * Generate and download Excel file from inventory export data with professional formatting
 */
export function downloadInventorySummaryExcel(
  data: ExportItem[],
  filename: string = `báo-cáo-tồn-kho-${new Date().toISOString().split('T')[0]}.xlsx`,
  warehouseName?: string,
  fromDate?: string,
  toDate?: string
) {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Prepare worksheet data
  const wsData: any[] = []

  // Add title and metadata
  wsData.push(['BÁO CÁO NHẬP-XUẤT-TỒN KHO'])
  if (warehouseName) {
    wsData.push([`Kho: ${warehouseName}`])
  }
  if (fromDate || toDate) {
    wsData.push([`Từ ngày: ${fromDate || 'N/A'} - Đến ngày: ${toDate || 'N/A'}`])
  }
  wsData.push([`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`])
  wsData.push([]) // Empty row for spacing

  // Add summary section
  wsData.push(['TỔNG HỢP'])
  wsData.push(['Chỉ tiêu', 'Số lượng'])

  // Calculate totals
  const totals = data.reduce(
    (acc, item) => {
      const opening = Number(item.openingStock ?? 0)
      const imp = Number(item.importQuantity ?? 0)
      const exp = Number(item.exportQuantity ?? 0)
      return {
        opening: acc.opening + opening,
        import: acc.import + imp,
        export: acc.export + exp,
        closing: acc.closing + opening + imp - exp,
      }
    },
    { opening: 0, import: 0, export: 0, closing: 0 }
  )

  wsData.push(['Tồn đầu kỳ', totals.opening])
  wsData.push(['Số lượng nhập', totals.import])
  wsData.push(['Số lượng xuất', totals.export])
  wsData.push(['Tồn cuối kỳ', totals.closing])
  wsData.push([]) // Empty row for spacing

  // Add data table header
  wsData.push(['CHI TIẾT VẬT TƯ'])
  wsData.push(['Mã vật tư', 'Tên vật tư', 'ĐVT', 'Tồn đầu', 'Nhập', 'Xuất', 'Tồn cuối'])

  // Add data rows
  data.forEach((item) => {
    const opening = Number(item.openingStock ?? 0)
    const imp = Number(item.importQuantity ?? 0)
    const exp = Number(item.exportQuantity ?? 0)
    const closing = opening + imp - exp

    wsData.push([
      item.materialCode || '',
      item.materialName || '',
      item.unit || '',
      opening,
      imp,
      exp,
      closing,
    ])
  })

  // Create worksheet from data
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Set column widths
  ws['!cols'] = [
    { wch: 18 }, // Mã vật tư
    { wch: 38 }, // Tên vật tư
    { wch: 12 }, // ĐVT
    { wch: 12 }, // Tồn đầu
    { wch: 12 }, // Nhập
    { wch: 12 }, // Xuất
    { wch: 12 }, // Tồn cuối
  ]

  // Set print options
  ws['!print'] = {
    orientation: 'landscape',
    paperSize: 'A4',
  }

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo tồn kho')

  // Download file
  XLSX.writeFile(wb, filename)
}
