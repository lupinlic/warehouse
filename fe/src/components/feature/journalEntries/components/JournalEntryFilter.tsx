'use client'

import { useState } from 'react'
import SearchInput from '@/components/shared/form/SearchInput'

interface JournalEntryFilterProps {
  onFilter: (filters: {
    search: string
    status: string
  }) => void
}

export default function JournalEntryFilter({ onFilter }: JournalEntryFilterProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilter({ search: value, status })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    onFilter({ search, status: newStatus })
  }

  return (
    <div className="mb-4 p-4 bg-white rounded-lg border border-border space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchInput
          placeholder="Tìm kiếm theo mã phiếu, mô tả..."
          value={search}
          onChange={handleSearchChange}
        />

        <select
          value={status}
          onChange={handleStatusChange}
          className="px-3 py-2 border border-border rounded-md text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="POSTED">Đã ghi</option>
          <option value="DRAFT">Nháp</option>
          <option value="CANCELLED">Hủy bỏ</option>
        </select>
      </div>
    </div>
  )
}
