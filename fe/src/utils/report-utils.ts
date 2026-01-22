import type { ReportInOutStock } from '@/mock/report-inout-stock.mock'

/**
 * Top vật tư xuất kho nhiều nhất
 */
export const topExportMaterials = (
  data: ReportInOutStock[],
  top = 5
) => {
  return [...data]
    .sort((a, b) => b.exportQty - a.exportQty)
    .slice(0, top)
}

/**
 * Cơ cấu tồn kho (Top + Khác)
 */
export const stockStructureData = (
  data: ReportInOutStock[],
  top = 5
) => {
  const sorted = [...data].sort(
    (a, b) => b.closingQty - a.closingQty
  )

  const topItems = sorted.slice(0, top)

  const otherQty = sorted
    .slice(top)
    .reduce((sum, i) => sum + i.closingQty, 0)

  return [
    ...topItems.map((i) => ({
      name: i.materialName,
      value: i.closingQty,
    })),
    ...(otherQty > 0
      ? [{ name: 'Khác', value: otherQty }]
      : []),
  ]
}
