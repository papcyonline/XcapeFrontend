// src/components/leads/lead-details-modal.tsx
"use client"

import { useState, useEffect } from 'react'
import { 
  X, 
  Mail, 
  Phone, 
  ExternalLink, 
  MapPin, 
  Building, 
  Calendar,
  Star,
  Save,
  Edit,
  Copy,
  CheckCircle
} from 'lucide-react'
import { leadsApi } from '@/lib/api'

interface LeadDetailsModalProps {
  lead: any
  isOpen: boolean
  onClose: () => void
  editMode?: boolean
  onSave?: (updatedLead: any) => void
}

const statusColors = {
  not_contacted: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  qualified: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  unqualified: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  converted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

export function LeadDetailsModal({ lead, isOpen, onClose, editMode = false, onSave }: LeadDetailsModalProps) {
  const [isEditMode, setIsEditMode] = useState(editMode)
  const [formData, setFormData] = useState(lead)
  const [loading, setLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState('')

  useEffect(() => {
    setFormData(lead)
    setIsEditMode(editMode)
  }, [lead, editMode])

  if (!isOpen) return null

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedLead = await leadsApi.update(lead.id, formData)
      onSave?.(updatedLead)
      setIsEditMode(false)
    } catch (error) {
      console.error('Failed to update lead:', error)
      alert('Failed to update lead')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(lead)
    setIsEditMode(false)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Lead' : 'Lead Details'}
            </h2>
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Edit Lead"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Company & Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.company_name || ''}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formData.company_name || 'No company name'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Name
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-white">
                    {formData.name || 'No contact name'}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.industry || ''}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-white">
                    {formData.industry || 'No industry'}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                {isEditMode ? (
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {formData.email ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${formData.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {formData.email}
                        </a>
                        <button
                          onClick={() => copyToClipboard(formData.email, 'email')}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy email"
                        >
                          {copySuccess === 'email' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">No email</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                {isEditMode ? (
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {formData.phone ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${formData.phone}`}
                          className="text-gray-900 dark:text-white hover:text-blue-600"
                        >
                          {formData.phone}
                        </a>
                        <button
                          onClick={() => copyToClipboard(formData.phone, 'phone')}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy phone"
                        >
                          {copySuccess === 'phone' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">No phone</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                {isEditMode ? (
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    {formData.website ? (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    ) : (
                      <span className="text-gray-500">No website</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location & Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {formData.city || 'No location'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lead Score
              </label>
              {isEditMode ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.lead_score || 0}
                  onChange={(e) => handleInputChange('lead_score', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${getScoreColor(formData.lead_score || 0)}`}>
                    {formData.lead_score || 0}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor((formData.lead_score || 0) / 20) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Status
              </label>
              {isEditMode ? (
                <select
                  value={formData.contact_status || 'not_contacted'}
                  onChange={(e) => handleInputChange('contact_status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="not_contacted">Not Contacted</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="unqualified">Unqualified</option>
                  <option value="converted">Converted</option>
                </select>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[formData.contact_status as keyof typeof statusColors] || statusColors.not_contacted}`}>
                  {formData.contact_status ? formData.contact_status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Not Contacted'}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Created Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {formatDate(formData.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            {isEditMode ? (
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Add notes about this lead..."
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[100px]">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {formData.notes || 'No notes added yet.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          {isEditMode ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              {formData.email && (
                <button
                  onClick={() => {
                    const subject = `Regarding ${formData.company_name || 'Your Business'}`
                    const body = `Hi ${formData.name || 'there'},\n\nI hope this email finds you well. I wanted to reach out regarding your business at ${formData.company_name || 'your company'}.\n\nBest regards,\n[Your Name]`
                    const mailtoUrl = `mailto:${formData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                    window.open(mailtoUrl, '_blank')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}