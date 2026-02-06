/**
 * JournalEntry (Sổ nhật ký kế toán) - Ghi lại các bút toán kế toán
 */

export interface Account {
  id: string
  code: string
  name: string
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'
  status: 'ACTIVE' | 'INACTIVE'
  category?: string
  created_at: string
  updated_at: string
}

export interface JournalEntryLine {
  id: string
  debit: string
  credit: string
  account: Account
  account_id: string
  journal_entry_id: string
}

export interface JournalEntry {
  id: string
  code: string
  date: string
  description: string
  status: 'DRAFT' | 'POSTED' | 'CANCELLED'
  lines: JournalEntryLine[]
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

// Types cho hiển thị trong table
export interface JournalEntryDisplay {
  id: string
  code: string
  date: string
  description: string
  status: string
  debitTotal: number
  creditTotal: number
  accountCount: number
  createdAt: string
}
