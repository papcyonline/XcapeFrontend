"use client"

import { useState } from 'react'
import { EmailTemplateEditor } from '@/components/campaigns/email-template-editor'
import { CampaignManager } from '@/components/campaigns/campaign-manager'
import { Mail, Edit, BarChart3 } from 'lucide-react'

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates'>('campaigns')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Email Campaigns
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Create, manage, and track your email marketing campaigns
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'campaigns'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'templates'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Edit className="h-5 w-5" />
            Templates
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'campaigns' ? (
          <CampaignManager />
        ) : (
          <EmailTemplateEditor />
        )}
      </div>
    </div>
  )
}