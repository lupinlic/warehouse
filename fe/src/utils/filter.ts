export function filterByKeyword<T>(
  data: T[],
  keyword: string,
  keys: (keyof T)[]
): T[] {
  if (!keyword.trim()) return data

  const lower = keyword.toLowerCase()

  return data.filter((item) =>
    keys.some((key) =>
      String(item[key]).toLowerCase().includes(lower)
    )
  )
}
