/**
 * Format number as Vietnamese currency (VNĐ)
 */
export function formatCurrency(value: number): string {
  return `${value.toLocaleString('vi-VN')} VNĐ`
}

/**
 * Format date to Vietnamese format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('vi-VN')
}
