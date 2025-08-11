"use client"

import { useState } from 'react'
import { 
  Play, 
  Pause, 
  Square, 
  Edit, 
  Trash2, 
  BarChart3, 
  Users, 
  Mail, 
  Send,
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  Copy,
  Plus
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  template_name: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
  total_recipients: number
  sent_count: number
  open_rate: number
  click_rate: number
  reply_rate: number
  created_at: string
  scheduled_at?: string
  completed_at?: string
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Tech Outreach',
    template_name: 'Cold Outreach',
    status: 'sent',
    total_recipients: 150,
    sent_count: 150,
    open_rate: 34.5,
    click_rate: 12.3,
    reply_rate: 8.7,
    created_at: '2024-01-15T10:30:00Z',
    completed_at: '2024-01-16T14:22:00Z'
  },
  {
    id: '2',
    name: 'Follow-up Campaign',
    template_name: 'Follow-up',
    status: 'sending',
    total_recipients: 89,
    sent_count: 45,
    open_rate: 28.9,
    click_rate: 9.1,
    reply_rate: 6.2,
    created_at: '2024-01-18T09:15:00Z'
  },
  {
    id: '3',
    name: 'Demo Invitations',
    template_name: 'Demo Invitation',
    status: 'scheduled',
    total_recipients: 67,
    sent_count: 0,
    open_rate: 0,
    click_rate: 0,
    reply_rate: 0,
    created_at: '2024-01-20T11:45:00Z',
    scheduled_at: '2024-01-22T10:00:00Z'
  },
  {
    id: '4',
    name: 'Enterprise Prospects',
    template_name: 'Cold Outreach',
    status: 'draft',
    total_recipients: 234,
    sent_count: 0,
    open_rate: 0,
    click_rate: 0,
    reply_rate: 0,
    created_at: '2024-01-21T16:20:00Z'
  }
]

const statusConfig = {
  draft: { 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    icon: Edit,
    label: 'Draft'
  },
  scheduled: { 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    icon: Calendar,
    label: 'Scheduled'
  },
  sending: { 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    icon: Send,
    label: 'Sending'
  },
  sent: { 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    icon: Mail,
    label: 'Sent'
  },
  paused: { 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    icon: Pause,
    label: 'Paused'
  }
}

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const updateCampaignStatus = (campaignId: string, newStatus: Campaign['status']) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: newStatus }
        : campaign
    ))
  }

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId))
  }

  const duplicateCampaign = (campaign: Campaign) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      sent_count: 0,
      open_rate: 0,
      click_rate: 0,
      reply_rate: 0,
      created_at: new Date().toISOString(),
      scheduled_at: undefined,
      completed_at: undefined
    }
    setCampaigns([newCampaign, ...campaigns])
  }

  const getProgressPercentage = (campaign: Campaign) => {
    if (campaign.total_recipients === 0) return 0
    return Math.round((campaign.sent_count / campaign.total_recipients) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Campaigns</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {campaigns.length} campaigns • {campaigns.filter(c => c.status === 'sent').length} completed
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Campaign
        </button>
      </div>

      {/* Campaign Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Campaigns</h3>
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{campaigns.length}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {campaigns.filter(c => c.status === 'sending').length} active
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Recipients</h3>
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {campaigns.reduce((sum, c) => sum + c.total_recipients, 0)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {campaigns.reduce((sum, c) => sum + c.sent_count, 0)} emails sent
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Open Rate</h3>
            <Eye className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {(campaigns.filter(c => c.sent_count > 0).reduce((sum, c) => sum + c.open_rate, 0) / 
              campaigns.filter(c => c.sent_count > 0).length || 0).toFixed(1)}%
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">+2.3% vs last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Reply Rate</h3>
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {(campaigns.filter(c => c.sent_count > 0).reduce((sum, c) => sum + c.reply_rate, 0) / 
              campaigns.filter(c => c.sent_count > 0).length || 0).toFixed(1)}%
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">+1.8% vs last month</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Campaign</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Performance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns.map((campaign) => {
                const statusInfo = statusConfig[campaign.status]
                const StatusIcon = statusInfo.icon
                const progress = getProgressPercentage(campaign)

                return (
                  <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Template: {campaign.template_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {campaign.sent_count} / {campaign.total_recipients}
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
                      {campaign.sent_count > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Open: {campaign.open_rate}%</span>
                            <span className="text-gray-600 dark:text-gray-400">Click: {campaign.click_rate}%</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Reply: {campaign.reply_rate}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">Not sent yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </div>
                      {campaign.scheduled_at && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Scheduled: {new Date(campaign.scheduled_at).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {/* Action buttons based on status */}
                        {campaign.status === 'draft' && (
                          <button
                            onClick={() => updateCampaignStatus(campaign.id, 'scheduled')}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title="Schedule Campaign"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        
                        {campaign.status === 'sending' && (
                          <button
                            onClick={() => updateCampaignStatus(campaign.id, 'paused')}
                            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                            title="Pause Campaign"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        )}

                        {campaign.status === 'paused' && (
                          <button
                            onClick={() => updateCampaignStatus(campaign.id, 'sending')}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title="Resume Campaign"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}

                        {campaign.status === 'scheduled' && (
                          <button
                            onClick={() => updateCampaignStatus(campaign.id, 'draft')}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Cancel Schedule"
                          >
                            <Square className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedCampaign(campaign)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="View Analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => duplicateCampaign(campaign)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          title="Duplicate Campaign"
                        >
                          <Copy className="h-4 w-4" />
                        </button>

                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit Campaign"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete Campaign"
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

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first email campaign to start reaching out to leads
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Campaign
            </button>
          </div>
        )}
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCampaign.name}</h3>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Campaign Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Template:</span>
                        <span className="text-gray-900 dark:text-white">{selectedCampaign.template_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${statusConfig[selectedCampaign.status].color}`}>
                          {statusConfig[selectedCampaign.status].label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Recipients:</span>
                        <span className="text-gray-900 dark:text-white">{selectedCampaign.total_recipients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Sent:</span>
                        <span className="text-gray-900 dark:text-white">{selectedCampaign.sent_count}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Open Rate</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedCampaign.open_rate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${selectedCampaign.open_rate}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Click Rate</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedCampaign.click_rate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${selectedCampaign.click_rate}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Reply Rate</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedCampaign.reply_rate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${selectedCampaign.reply_rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Campaign</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter campaign name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Template
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    <option>Cold Outreach</option>
                    <option>Follow-up</option>
                    <option>Demo Invitation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Leads
                  </label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    This will open the lead selector to choose recipients
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    // Here you would navigate to the campaign creation flow
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}