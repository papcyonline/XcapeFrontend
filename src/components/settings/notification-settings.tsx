// Notification Settings Component
"use client"

import { useState } from 'react'
import { Bell, Mail, MessageSquare, TrendingUp } from 'lucide-react'

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    email_notifications: {
      new_leads: true,
      campaign_updates: true,
      weekly_reports: false,
      system_alerts: true
    },
    push_notifications: {
      new_leads: false,
      campaign_completed: true,
      mentions: true,
      security_alerts: true
    },
    frequency: 'immediate'
  })

  const updateSetting = (category: 'email_notifications' | 'push_notifications', setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Choose what email notifications you want to receive</p>
        </div>

        <div className="p-6 space-y-4">
          {Object.entries(settings.email_notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {key === 'new_leads' && 'Get notified when new leads are generated'}
                  {key === 'campaign_updates' && 'Updates on email campaign performance'}
                  {key === 'weekly_reports' && 'Weekly summary of your lead generation'}
                  {key === 'system_alerts' && 'Important system notifications'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateSetting('email_notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Push Notifications</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage browser and mobile push notifications</p>
        </div>

        <div className="p-6 space-y-4">
          {Object.entries(settings.push_notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {key === 'new_leads' && 'Instant notifications for new leads'}
                  {key === 'campaign_completed' && 'When email campaigns finish sending'}
                  {key === 'mentions' && 'When someone mentions you in comments'}
                  {key === 'security_alerts' && 'Important security notifications'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateSetting('push_notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Frequency */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Frequency</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">How often you want to receive notifications</p>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {[
              { value: 'immediate', label: 'Immediate', desc: 'Get notified right away' },
              { value: 'hourly', label: 'Hourly Digest', desc: 'Bundled notifications every hour' },
              { value: 'daily', label: 'Daily Summary', desc: 'Once per day summary' },
              { value: 'weekly', label: 'Weekly Report', desc: 'Weekly summary only' }
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={settings.frequency === option.value}
                  onChange={(e) => setSettings({...settings, frequency: e.target.value})}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}