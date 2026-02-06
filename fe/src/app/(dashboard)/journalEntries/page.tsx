import type { Metadata } from 'next'
import JournalEntriesView from '@/components/feature/journalEntries'

export const metadata: Metadata = {
  title: 'Sổ nhật ký | Kế toán vật tư VNPT Yên Bái',
}

export default function JournalEntriesPage() {
  return (
    <div>
      <JournalEntriesView />
    </div>
  )
}
