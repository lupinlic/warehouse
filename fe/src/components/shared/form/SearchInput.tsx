'use client'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        h-9 w-64 rounded-md border border-border px-3 text-sm
        focus:outline-none focus:ring-1 focus:ring-primary
      "
    />
  )
}
