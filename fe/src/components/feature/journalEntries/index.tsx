'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import PageTitle from '@/components/shared/common/PageTitle'
import JournalEntryFilter from './components/JournalEntryFilter'
import JournalEntryDetail from './components/JournalEntryDetail'
import { journalEntryColumns } from './components/columns'
import { getAllJournalEntries, getJournalEntryById } from '@/services/journalEntries'
import type { JournalEntry, JournalEntryDisplay } from '@/types/journalEntry'

export default function JournalEntriesView() {
  const [data, setData] = useState<JournalEntryDisplay[]>([])
  const [filteredData, setFilteredData] = useState<JournalEntryDisplay[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
  })

  // Fetch journal entries on mount
  useEffect(() => {
    fetchJournalEntries(pagination.page)
  }, [])

  const fetchJournalEntries = async (page: number) => {
    try {
      setLoading(true)
      const res = await getAllJournalEntries(page, pagination.pageSize)
      setData(res.data || [])
      setFilteredData(res.data || [])
      setPagination({
        page,
        pageSize: res.pageSize,
        total: res.total,
      })
      console.log('Fetched journal entries:', res)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tải sổ nhật ký')
      console.error('Fetch journal entries error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (filters: {
    search: string
    status: string
  }) => {
    let filtered = data

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.code.toLowerCase().includes(searchLower) ||
          entry.description.toLowerCase().includes(searchLower)
      )
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((entry) => entry.status === filters.status)
    }

    setFilteredData(filtered)
  }

  const handleRowClick = async (row: JournalEntryDisplay) => {
    try {
      const entry = await getJournalEntryById(row.id)
      setSelectedEntry(entry)
      setDetailOpen(true)
    } catch (err: any) {
      toast.error('Lỗi khi tải chi tiết')
      console.error('Error:', err)
    }
  }

  const handlePageChange = (page: number) => {
    fetchJournalEntries(page)
  }

  return (
    <div className="space-y-4">
      <PageTitle
        title="Sổ nhật ký"
        subtitle="Xem danh sách các bút toán kế toán"
      />

      <JournalEntryFilter onFilter={handleFilter} />

      <DataTable
        columns={journalEntryColumns}
        data={filteredData}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        }}
        onRowClick={handleRowClick}
      />

      <JournalEntryDetail
        open={detailOpen}
        entry={selectedEntry}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  )
}
