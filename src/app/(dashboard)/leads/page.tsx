// src/app/(dashboard)/leads/page.tsx
import { LeadsTable } from '@/components/leads/leads-table'

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <LeadsTable />
    </div>
  )
}