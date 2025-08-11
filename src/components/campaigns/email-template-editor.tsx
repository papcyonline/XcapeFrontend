"use client"

import { useState } from 'react'
import { 
  Eye, 
  Code, 
  Save, 
  Send, 
  Users, 
  Type, 
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette
} from 'lucide-react'

interface EmailTemplate {
  id?: string
  name: string
  subject: string
  body: string
  variables: string[]
  preview_text?: string
}

const defaultTemplate: EmailTemplate = {
  name: 'Cold Outreach Template',
  subject: 'Quick question about {{company}}',
  body: `Hi {{name}},

I hope this email finds you well. I came across {{company}} and was impressed by your work in the {{industry}} space.

I noticed that many companies like yours face challenges with:
• Manual processes that slow down growth
• Difficulty scaling operations efficiently
• Time-consuming administrative tasks

We help {{industry}} companies streamline their workflows and increase productivity by up to 40%. 

Would you be open to a quick 15-minute call this week to discuss how we might be able to help {{company}} achieve similar results?

Best regards,
[Your Name]

P.S. I'd be happy to share a case study of how we helped [Similar Company] increase their efficiency by 35%.`,
  variables: ['name', 'company', 'industry'],
  preview_text: 'Quick question about your automation needs...'
}

const predefinedTemplates = [
  {
    name: 'Cold Outreach',
    subject: 'Quick question about {{company}}',
    body: defaultTemplate.body,
    variables: ['name', 'company', 'industry']
  },
  {
    name: 'Follow-up',
    subject: 'Following up on our conversation',
    body: `Hi {{name}},

I wanted to follow up on our previous conversation about {{company}}'s automation needs.

Since we last spoke, I've put together some specific ideas that could help {{company}} save time and increase efficiency.

Would you be available for a brief call this week to discuss these opportunities?

Best regards,
[Your Name]`,
    variables: ['name', 'company']
  },
  {
    name: 'Demo Invitation',
    subject: 'See how {{company}} can save 10+ hours per week',
    body: `Hi {{name}},

Based on our conversation, I think you'd be interested in seeing how our solution could help {{company}} automate your current manual processes.

I'd like to invite you to a personalized demo where I'll show you:
• How to automate your current workflows
• Real ROI calculations for {{company}}
• Implementation timeline and next steps

The demo takes about 20 minutes. Are you available this week?

Best regards,
[Your Name]`,
    variables: ['name', 'company']
  }
]

const variables = [
  { name: '{{name}}', description: 'Lead\'s first name' },
  { name: '{{full_name}}', description: 'Lead\'s full name' },
  { name: '{{company}}', description: 'Company name' },
  { name: '{{industry}}', description: 'Industry type' },
  { name: '{{city}}', description: 'Lead\'s city' },
  { name: '{{website}}', description: 'Company website' },
  { name: '{{lead_score}}', description: 'Lead quality score' }
]

export function EmailTemplateEditor() {
  const [template, setTemplate] = useState<EmailTemplate>(defaultTemplate)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false)

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('email-body') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newBody = template.body.substring(0, start) + variable + template.body.substring(end)
      setTemplate({ ...template, body: newBody })
    }
  }

  const loadTemplate = (templateData: any) => {
    setTemplate({
      ...template,
      name: templateData.name,
      subject: templateData.subject,
      body: templateData.body,
      variables: templateData.variables
    })
  }

  const saveTemplate = () => {
    console.log('Saving template:', template)
    // Here you would call your API to save the template
  }

  const createCampaign = () => {
    setIsCreatingCampaign(true)
    // Here you would call your API to create a campaign
    setTimeout(() => {
      setIsCreatingCampaign(false)
      console.log('Campaign created with template:', template)
    }, 2000)
  }

  const renderPreview = () => {
    let previewBody = template.body
    variables.forEach(variable => {
      const sampleData: any = {
        '{{name}}': 'John',
        '{{full_name}}': 'John Smith',
        '{{company}}': 'TechCorp Inc',
        '{{industry}}': 'Software',
        '{{city}}': 'San Francisco',
        '{{website}}': 'techcorp.com',
        '{{lead_score}}': '85'
      }
      previewBody = previewBody.replace(new RegExp(variable.name, 'g'), sampleData[variable.name] || variable.name)
    })

    let previewSubject = template.subject
    variables.forEach(variable => {
      const sampleData: any = {
        '{{name}}': 'John',
        '{{company}}': 'TechCorp Inc',
        '{{industry}}': 'Software'
      }
      previewSubject = previewSubject.replace(new RegExp(variable.name, 'g'), sampleData[variable.name] || variable.name)
    })

    return { subject: previewSubject, body: previewBody }
  }

  const preview = renderPreview()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Template Editor</h2>
          <p className="text-gray-600 dark:text-gray-300">Create and customize email templates for your campaigns</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={saveTemplate}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Template
          </button>
          <button
            onClick={createCampaign}
            disabled={isCreatingCampaign}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
            {isCreatingCampaign ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Template Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Templates</h3>
            <div className="space-y-3">
              {predefinedTemplates.map((tmpl, index) => (
                <button
                  key={index}
                  onClick={() => loadTemplate(tmpl)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{tmpl.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{tmpl.subject}</div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Variables</h4>
              <div className="space-y-2">
                {variables.map((variable) => (
                  <button
                    key={variable.name}
                    onClick={() => insertVariable(variable.name)}
                    className="w-full text-left p-2 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="text-sm font-mono text-blue-600 dark:text-blue-400">{variable.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{variable.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'editor'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Code className="h-4 w-4" />
                Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'preview'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'editor' ? (
                <div className="space-y-6">
                  {/* Template Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter template name"
                    />
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={template.subject}
                      onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter subject line (use variables like {{company}})"
                    />
                  </div>

                  {/* Preview Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preview Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={template.preview_text || ''}
                      onChange={(e) => setTemplate({ ...template, preview_text: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Text that appears in email preview"
                    />
                  </div>

                  {/* Email Body */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Body
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                      {/* Toolbar */}
                      <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <Bold className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <Italic className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <Underline className="h-4 w-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <AlignLeft className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <AlignCenter className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <AlignRight className="h-4 w-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <LinkIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <ImageIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <textarea
                        id="email-body"
                        value={template.body}
                        onChange={(e) => setTemplate({ ...template, body: e.target.value })}
                        rows={15}
                        className="w-full p-4 resize-none focus:outline-none dark:bg-gray-700 dark:text-white font-mono text-sm"
                        placeholder="Write your email content here. Use variables like {{name}} and {{company}} for personalization."
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Tip: Click on variables in the sidebar to insert them at your cursor position
                    </div>
                  </div>
                </div>
              ) : (
                /* Preview Tab */
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Preview</h3>
                    
                    {/* Email Headers */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">From:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">your-email@company.com</span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">To:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">john@techcorp.com</span>
                        </div>
                        <div className="mt-3">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {preview.subject}
                          </div>
                          {template.preview_text && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {template.preview_text}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {preview.body.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                      This preview shows how the email will appear with sample data. Variables will be replaced with actual lead information when sent.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}