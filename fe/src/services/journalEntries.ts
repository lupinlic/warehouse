import type { JournalEntry, JournalEntryDisplay } from '@/types/journalEntry'

// API Configuration for external Journal Entries API
const JOURNAL_ENTRIES_API_BASE = 'https://ware-house-xubn.onrender.com/api'

// ===== API Response Types =====
interface AccountApiResponse {
  id: string
  code: string
  name: string
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'
  status: 'ACTIVE' | 'INACTIVE'
  category?: string
  created_at: string
  updated_at: string
}

interface JournalLineItemApiResponse {
  id: string
  debit: string
  credit: string
  account_id: string
  account: AccountApiResponse
  journal_entry_id: string
}

interface JournalEntryApiResponse {
  id: string
  code: string
  date: string
  description: string
  status: 'POSTED' | 'DRAFT' | 'CANCELLED'
  lines: JournalLineItemApiResponse[]
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

// ===== Mapping Functions =====
/**
 * Transform API response to JournalEntry type
 */
function mapApiJournalEntryToJournalEntry(apiEntry: JournalEntryApiResponse): JournalEntry {
  return {
    id: apiEntry.id,
    code: apiEntry.code,
    date: apiEntry.date,
    description: apiEntry.description,
    status: apiEntry.status,
    lines: apiEntry.lines?.map((line) => ({
      id: line.id,
      debit: line.debit,
      credit: line.credit,
      account_id: line.account_id,
      account: {
        id: line.account.id,
        code: line.account.code,
        name: line.account.name,
        type: line.account.type,
        status: line.account.status,
        category: line.account.category,
        created_at: line.account.created_at,
        updated_at: line.account.updated_at,
      },
      journal_entry_id: line.journal_entry_id,
    })) || [],
    created_at: apiEntry.created_at,
    updated_at: apiEntry.updated_at,
    deleted_at: apiEntry.deleted_at,
  }
}

function mapApiResponseList(apiData: JournalEntryApiResponse[]): JournalEntry[] {
  return apiData.map(mapApiJournalEntryToJournalEntry)
}

/**
 * Transform JournalEntry to display format for table
 */
function mapJournalEntryToDisplay(entry: JournalEntry): JournalEntryDisplay {
  const debitTotal = entry.lines.reduce((sum, line) => sum + parseFloat(line.debit || '0'), 0)
  const creditTotal = entry.lines.reduce((sum, line) => sum + parseFloat(line.credit || '0'), 0)

  return {
    id: entry.id,
    code: entry.code,
    date: entry.date,
    description: entry.description,
    status: entry.status,
    debitTotal,
    creditTotal,
    accountCount: entry.lines.length,
    createdAt: entry.created_at,
  }
}

function mapApiListToDisplay(entries: JournalEntry[]): JournalEntryDisplay[] {
  return entries.map(mapJournalEntryToDisplay)
}

// ===== Helper Function to Get Access Token =====
/**
 * Lấy access token từ cookie
 */
function getAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  try {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'accessToken' && value) {
        return decodeURIComponent(value)
      }
    }
    return null
  } catch (e) {
    console.error('[journal-entries] Error reading access token:', e)
    return null
  }
}

// ===== API Helper Functions =====
/**
 * Fetch từ external Journal Entries API (có authentication)
 */
async function fetchJournalEntriesApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${JOURNAL_ENTRIES_API_BASE}${endpoint}`

  const token = getAccessTokenFromCookie()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  console.debug(`[journal-entries] GET ${url}`)

  try {
    const response = await fetch(url, {
      method: 'GET',
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[journal-entries] HTTP ${response.status}:`, errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json() as T
    return data
  } catch (error) {
    console.error(`[journal-entries] Fetch failed:`, error)
    throw error
  }
}

// ===== Public API Functions =====
/**
 * Lấy danh sách tất cả journal entries với phân trang
 */
export async function getAllJournalEntries(page: number = 1, pageSize: number = 20) {
  try {
    console.debug(`[journal-entries] getAllJournalEntries page=${page} pageSize=${pageSize}`)

    // Fetch từ external API
    const apiData = await fetchJournalEntriesApi<JournalEntryApiResponse[]>('/journal-entries')

    // Map dữ liệu
    const entries = Array.isArray(apiData) ? mapApiResponseList(apiData) : []

    // Phân trang
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = entries.slice(start, end)

    return {
      data: mapApiListToDisplay(paginatedData),
      total: entries.length,
      page,
      pageSize,
    }
  } catch (error) {
    console.error('[journal-entries] getAllJournalEntries failed:', error)
    throw error
  }
}

/**
 * Lấy chi tiết một journal entry theo ID
 */
export async function getJournalEntryById(id: string) {
  try {
    console.debug(`[journal-entries] getJournalEntryById id=${id}`)

    const apiData = await fetchJournalEntriesApi<JournalEntryApiResponse>(`/journal-entries/${id}`)
    return mapApiJournalEntryToJournalEntry(apiData)
  } catch (error) {
    console.error(`[journal-entries] getJournalEntryById(${id}) failed:`, error)
    throw error
  }
}

/**
 * Lấy journal entries theo trạng thái
 */
export async function getJournalEntriesByStatus(status: 'POSTED' | 'DRAFT' | 'CANCELLED') {
  try {
    console.debug(`[journal-entries] getJournalEntriesByStatus status=${status}`)

    const query = new URLSearchParams({ status })
    const apiData = await fetchJournalEntriesApi<JournalEntryApiResponse[]>(
      `/journal-entries?${query.toString()}`
    )

    const entries = Array.isArray(apiData) ? mapApiResponseList(apiData) : []
    return entries
  } catch (error) {
    console.error(`[journal-entries] getJournalEntriesByStatus(${status}) failed:`, error)
    throw error
  }
}

/**
 * Lấy journal entries trong khoảng ngày xác định
 */
export async function getJournalEntriesByDateRange(startDate: string, endDate: string) {
  try {
    console.debug(`[journal-entries] getJournalEntriesByDateRange start=${startDate} end=${endDate}`)

    const query = new URLSearchParams({
      startDate,
      endDate,
    })
    const apiData = await fetchJournalEntriesApi<JournalEntryApiResponse[]>(
      `/journal-entries?${query.toString()}`
    )

    const entries = Array.isArray(apiData) ? mapApiResponseList(apiData) : []
    return entries
  } catch (error) {
    console.error(
      `[journal-entries] getJournalEntriesByDateRange(${startDate}, ${endDate}) failed:`,
      error
    )
    throw error
  }
}
