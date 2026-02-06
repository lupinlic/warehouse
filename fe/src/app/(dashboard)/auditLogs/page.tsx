import type { Metadata } from 'next'
import AuditLogsView from '@/components/feature/auditLogs'

export const metadata: Metadata = {
  title: 'Nhật ký thao tác | Kế toán vật tư VNPT Yên Bái',
}

export default function AuditLogsPage() {
  return (
    <div>
      <AuditLogsView />
    </div>
  )
}
