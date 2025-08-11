import { ImportExportCenter } from '@/components/import-export/import-export-center'

export default function ImportExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Import/Export Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Manage your lead data imports and exports efficiently
        </p>
      </div>
      
      <ImportExportCenter />
    </div>
  )
}