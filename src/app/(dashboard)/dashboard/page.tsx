// src/app/(dashboard)/dashboard/page.tsx
"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth-store'
import { analyticsApi, userApi, leadsApi } from '@/lib/api'

interface DashboardData {
  overview: any
  userStats: any
  allLeads: any[]
  recentLeads: any[]
}

export default function DashboardPage() {
  const { user, setUser } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load analytics data from your backend endpoints
      const [overviewRes, statusRes, industryRes, recentRes, profileRes] = await Promise.allSettled([
        analyticsApi.getOverview(),
        analyticsApi.getStatusDistribution(),
        analyticsApi.getIndustryBreakdown(),
        analyticsApi.getRecentActivity(5),
        userApi.getProfile()
      ])

      const dashboardData: DashboardData = {
        overview: overviewRes.status === 'fulfilled' ? overviewRes.value.data : {},
        userStats: statusRes.status === 'fulfilled' ? statusRes.value.data : {},
        allLeads: [], // Not needed anymore since we use analytics
        recentLeads: recentRes.status === 'fulfilled' ? recentRes.value.data : []
      }

      // Update user profile with fresh data
      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        setUser({ ...user!, ...profileRes.value.data })
      }

      setData(dashboardData)
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Dashboard Error</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Use real analytics data from backend
  const overview = data?.overview || {}
  const statusStats = data?.userStats || {}
  
  // Get values from analytics API
  const totalLeads = overview.total_leads || 0
  const thisMonthLeads = overview.leads_this_month || 0
  const conversionRate = overview.conversion_rate || 0
  const avgScore = overview.avg_lead_score || 0

  // Quota calculations from backend
  const quota = user?.leads_quota || 100
  const used = user?.leads_used || overview.quota_usage?.used || 0
  const quotaPercent = (used / quota) * 100
  const isNearLimit = quotaPercent >= 80
  const isOverLimit = quotaPercent >= 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user?.full_name || 'User'}! Here's what's happening with your leads.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/generate"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            ⚡ Generate Leads
          </Link>
          <button 
            onClick={loadDashboardData}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Current Plan Status */}
      {user && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Current Plan: <span className="capitalize">{user.subscription_plan || 'free'}</span>
              </h3>
              <p className="text-blue-700 dark:text-blue-200 text-sm">
                You've used {used} of {quota} leads this month
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/pricing"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {user.subscription_plan === 'enterprise' ? 'Manage Plan' : 'Upgrade Plan'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Real Data Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Leads</h3>
            <span className="text-gray-400">👥</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {totalLeads}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            +{thisMonthLeads} this month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Conversion Rate</h3>
            <span className="text-gray-400">📈</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {conversionRate}%
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Based on lead statuses
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quota Usage</h3>
            <span className="text-gray-400">🎯</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {Math.round(quotaPercent)}%
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isOverLimit ? 'bg-red-600' : 
                isNearLimit ? 'bg-yellow-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(quotaPercent, 100)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {used} / {quota} leads used
            </p>
            {isNearLimit && (
              <Link 
                href="/pricing" 
                className="text-xs text-blue-600 hover:text-blue-500 font-medium"
              >
                {isOverLimit ? 'Upgrade Now' : 'Upgrade'}
              </Link>
            )}
          </div>
          {isOverLimit && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-400">
              ⚠️ Quota exceeded! Upgrade to generate more leads.
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Lead Score</h3>
            <span className="text-gray-400">⭐</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {avgScore}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Out of 100 points
          </p>
        </div>
      </div>

      {/* Lead Status Breakdown - Using Real Analytics Data */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Status Breakdown</h3>
        <div className="grid gap-4 md:grid-cols-5">
          {[
            { status: 'Not Contacted', key: 'not_contacted', color: 'bg-gray-500' },
            { status: 'Contacted', key: 'contacted', color: 'bg-blue-500' },
            { status: 'Qualified', key: 'qualified', color: 'bg-yellow-500' },
            { status: 'Unqualified', key: 'unqualified', color: 'bg-red-500' },
            { status: 'Converted', key: 'converted', color: 'bg-green-500' }
          ].map(({ status, key, color }) => {
            const count = statusStats[key] || 0
            const total = Object.values(statusStats).reduce((sum: number, val: any) => sum + (val || 0), 0)
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0
            
            return (
              <div key={key} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-4 h-4 ${color} rounded-full mx-auto mb-2`}></div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{status}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{percentage}%</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/generate"
            className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl mb-2">⚡</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Generate New Leads</span>
          </Link>
          <Link
            href="/campaigns"
            className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl mb-2">📧</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Create Campaign</span>
          </Link>
          <Link
            href="/import-export"
            className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl mb-2">📥</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Import Leads</span>
          </Link>
        </div>
      </div>

      {/* Recent Leads */}
      {data && data.recentLeads && data.recentLeads.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Leads</h3>
            <Link href="/leads" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentLeads.map((activity: any) => (
              <div key={activity.lead_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{activity.company_name || 'No company'}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span>Status: {activity.status || 'not_contacted'}</span>
                    <span>Source: {activity.source}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : 'No date'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}