"use client"

import { useState, useRef } from 'react'
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  ArrowRight,
  FileSpreadsheet,
  Database,
  Filter,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react'

interface ImportJob {
  id: string
  filename: string
  status: 'processing' | 'completed' | 'failed' | 'mapping'
  total_rows: number
  processed_rows: number
  success_count: number
  error_count: number
  created_at: string
  errors?: string[]
}

interface ExportJob {
  id: string
  name: string
  format: 'csv' | 'excel' | 'json'
  status: 'processing' | 'completed' | 'failed'
  total_records: number
  file_size?: string
  download_url?: string
  created_at: string
  expires_at: string
}

const mockImportJobs: ImportJob[] = [
  {
    id: '1',
    filename: 'tech_leads_q1.csv',
    status: 'completed',
    total_rows: 150,
    processed_rows: 150,
    success_count: 147,
    error_count: 3,
    created_at: '2024-01-15T10:30:00Z',
    errors: ['Row 12: Invalid email format', 'Row 45: Missing company name', 'Row 89: Duplicate email']
  },
  {
    id: '2',
    filename: 'startup_contacts.xlsx',
    status: 'processing',
    total_rows: 89,
    processed_rows: 65,
    success_count: 62,
    error_count: 3,
    created_at: '2024-01-18T09:15:00Z'
  },
  {
    id: '3',
    filename: 'enterprise_prospects.csv',
    status: 'failed',
    total_rows: 0,
    processed_rows: 0,
    success_count: 0,
    error_count: 1,
    created_at: '2024-01-20T11:45:00Z',
    errors: ['File format not supported']
  }
]

const mockExportJobs: ExportJob[] = [
  {
    id: '1',
    name: 'All Leads Export',
    format: 'csv',
    status: 'completed',
    total_records: 1247,
    file_size: '2.3 MB',
    download_url: '/exports/all_leads_20240115.csv',
    created_at: '2024-01-15T14:22:00Z',
    expires_at: '2024-01-22T14:22:00Z'
  },
  {
    id: '2',
    name: 'Qualified Leads Only',
    format: 'excel',
    status: 'processing',
    total_records: 234,
    created_at: '2024-01-18T16:30:00Z',
    expires_at: '2024-01-25T16:30:00Z'
  },
  {
    id: '3',
    name: 'Campaign Performance Data',
    format: 'json',
    status: 'completed',
    total_records: 45,
    file_size: '156 KB',
    download_url: '/exports/campaign_data_20240120.json',
    created_at: '2024-01-20T08:15:00Z',
    expires_at: '2024-01-27T08:15:00Z'
  }
]

const statusConfig = {
  processing: { 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    icon: RefreshCw,
    label: 'Processing'
  },
  completed: { 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    icon: CheckCircle,
    label: 'Completed'
  },
  failed: { 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    icon: AlertCircle,
    label: 'Failed'
  },
  mapping: { 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    icon: Database,
    label: 'Field Mapping'
  }
}

export function ImportExportCenter() {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
  const [importJobs, setImportJobs] = useState(mockImportJobs)
  const [exportJobs, setExportJobs] = useState(mockExportJobs)
  const [dragActive, setDragActive] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedImportJob, setSelectedImportJob] = useState<ImportJob | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (file) {
      // Create new import job
      const newJob: ImportJob = {
        id: Date.now().toString(),
        filename: file.name,
        status: 'processing',
        total_rows: Math.floor(Math.random() * 200) + 50,
        processed_rows: 0,
        success_count: 0,
        error_count: 0,
        created_at: new Date().toISOString()
      }
      setImportJobs([newJob, ...importJobs])
      
      // Simulate processing
      setTimeout(() => {
        setImportJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'completed', processed_rows: job.total_rows, success_count: job.total_rows - 2, error_count: 2 }
            : job
        ))
      }, 3000)
    }
  }

  const deleteImportJob = (jobId: string) => {
    setImportJobs(importJobs.filter(job => job.id !== jobId))
  }

  const deleteExportJob = (jobId: string) => {
    setExportJobs(exportJobs.filter(job => job.id !== jobId))
  }

  const createExport = (name: string, format: 'csv' | 'excel' | 'json', filters: any) => {
    const newExport: ExportJob = {
      id: Date.now().toString(),
      name,
      format,
      status: 'processing',
      total_records: Math.floor(Math.random() * 1000) + 100,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    setExportJobs([newExport, ...exportJobs])
    setShowExportModal(false)
    
    // Simulate processing
    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newExport.id 
          ? { 
              ...job, 
              status: 'completed', 
              file_size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
              download_url: `/exports/${name.toLowerCase().replace(/\s+/g, '_')}.${format}`
            }
          : job
      ))
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import/Export Center</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your data imports and exports
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'import'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Upload className="h-5 w-5" />
            Import Data
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'export'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Download className="h-5 w-5" />
            Export Data
          </button>
        </nav>
      </div>

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upload Your Lead Data
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Drag and drop your CSV or Excel file here, or click to browse
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Download Template
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FileSpreadsheet className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">Excel Files</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">.xlsx, .xls</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FileText className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">CSV Files</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">.csv</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Database className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">Auto Mapping</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Smart field detection</div>
              </div>
            </div>
          </div>

          {/* Import History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Import History</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">File</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Progress</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Results</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {importJobs.map((job) => {
                    const statusInfo = statusConfig[job.status]
                    const StatusIcon = statusInfo.icon
                    const progress = job.total_rows > 0 ? Math.round((job.processed_rows / job.total_rows) * 100) : 0

                    return (
                      <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">{job.filename}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className={`h-3 w-3 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                            {statusInfo.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {job.processed_rows} / {job.total_rows}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {job.status === 'completed' || job.status === 'failed' ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-green-600 dark:text-green-400">✓ {job.success_count}</span>
                                <span className="text-red-600 dark:text-red-400">✗ {job.error_count}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-500">Processing...</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            {job.error_count > 0 && (
                              <button
                                onClick={() => setSelectedImportJob(job)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="View Errors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteImportJob(job.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {importJobs.length === 0 && (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No imports yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload your first file to get started
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          {/* Export Options */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <FileText className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">CSV Export</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Export leads as comma-separated values
              </p>
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export as CSV
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excel Export</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Export leads as Excel spreadsheet
              </p>
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Export as Excel
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <Database className="h-12 w-12 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">JSON Export</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Export leads as structured JSON data
              </p>
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Export as JSON
              </button>
            </div>
          </div>

          {/* Export History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export History</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Export</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Format</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Records</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Size</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Expires</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {exportJobs.map((job) => {
                    const statusInfo = statusConfig[job.status]
                    const StatusIcon = statusInfo.icon

                    return (
                      <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900 dark:text-white">{job.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 dark:text-gray-300 uppercase">{job.format}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className={`h-3 w-3 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                            {statusInfo.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {job.total_records.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {job.file_size || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {new Date(job.expires_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            {job.status === 'completed' && job.download_url && (
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteExportJob(job.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Export</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Export Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter export name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data to Export
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">All Leads</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Filter by Status</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Filter by Date Range</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Filter by Tags</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fields to Include
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Name', 'Email', 'Company', 'Phone', 'Industry', 'Lead Score', 'Status', 'Tags', 'Created Date', 'Notes'].map((field) => (
                    <label key={field} className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createExport('Custom Export', 'csv', {})}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Error Details Modal */}
      {selectedImportJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Import Details: {selectedImportJob.filename}</h3>
                <button
                  onClick={() => setSelectedImportJob(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs ${statusConfig[selectedImportJob.status].color}`}>
                      {statusConfig[selectedImportJob.status].label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Rows:</span>
                    <span className="text-gray-900 dark:text-white">{selectedImportJob.total_rows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Processed:</span>
                    <span className="text-gray-900 dark:text-white">{selectedImportJob.processed_rows}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Successful:</span>
                    <span className="text-green-600 dark:text-green-400">{selectedImportJob.success_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Errors:</span>
                    <span className="text-red-600 dark:text-red-400">{selectedImportJob.error_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Imported:</span>
                    <span className="text-gray-900 dark:text-white">{new Date(selectedImportJob.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selectedImportJob.errors && selectedImportJob.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Import Errors</h4>
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="space-y-2">
                      {selectedImportJob.errors.map((error, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <p>Common solutions:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Check email format (must include @ symbol)</li>
                      <li>Ensure company names are not empty</li>
                      <li>Remove duplicate email addresses</li>
                      <li>Verify all required fields are filled</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}