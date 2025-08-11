// src/components/analytics/analytics-charts.tsx
"use client"

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Target,
  Globe,
  Star,
  Mail,
  Phone,
  CheckCircle
} from 'lucide-react'
import { analyticsApi } from '@/lib/api'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']

interface AnalyticsData {
  overview: any
  statusDistribution: any
  industryBreakdown: any[]
  dailyStats: any[]
  geographicDistribution: any[]
  scoreDistribution: any
}

export function AnalyticsCharts() {
  const [timeRange, setTimeRange] = useState('14')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [overviewRes, statusRes, industryRes, dailyRes, geoRes, scoreRes] = await Promise.allSettled([
        analyticsApi.getOverview(),
        analyticsApi.getStatusDistribution(),
        analyticsApi.getIndustryBreakdown(),
        analyticsApi.getDailyStats(parseInt(timeRange)),
        analyticsApi.getGeographicDistribution(),
        analyticsApi.getScoreDistribution()
      ])

      const analyticsData: AnalyticsData = {
        overview: overviewRes.status === 'fulfilled' ? overviewRes.value.data : {},
        statusDistribution: statusRes.status === 'fulfilled' ? statusRes.value.data : {},
        industryBreakdown: industryRes.status === 'fulfilled' ? industryRes.value.data : [],
        dailyStats: dailyRes.status === 'fulfilled' ? dailyRes.value.data : [],
        geographicDistribution: geoRes.status === 'fulfilled' ? geoRes.value.data : [],
        scoreDistribution: scoreRes.status === 'fulfilled' ? scoreRes.value.data : {}
      }

      setData(analyticsData)
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Analytics Error</h3>
        <p className="text-red-600 text-sm">{error}</p>
        <button 
          onClick={loadAnalyticsData}
          className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const overview = data?.overview || {}
  const statusData = data?.statusDistribution || {}
  const industryData = data?.industryBreakdown || []
  const dailyData = data?.dailyStats || []
  const geoData = data?.geographicDistribution || []
  const scoreData = data?.scoreDistribution || {}

  // Transform status data for pie chart
  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: count as number
  }))

  // Transform score data for bar chart
  const scoreChartData = [
    { range: '80-100', count: scoreData.high || 0 },
    { range: '40-79', count: scoreData.medium || 0 },
    { range: '0-39', count: scoreData.low || 0 }
  ]

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards - Real Data */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Total Leads</h3>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {overview.total_leads || 0}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-600 dark:text-green-400">+{overview.leads_this_month || 0}</span>
            <span className="text-gray-500 dark:text-gray-400">this month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Conversion Rate</h3>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {overview.conversion_rate || 0}%
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Contact rate: {overview.contact_rate || 0}%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Avg Lead Score</h3>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {overview.avg_lead_score || 0}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Out of 100</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Quota Usage</h3>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {overview.quota_usage?.percentage || 0}%
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {overview.quota_usage?.used || 0} / {overview.quota_usage?.total || 100}
            </span>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
        <div className="flex gap-2">
          {[
            { label: '7D', value: '7' },
            { label: '14D', value: '14' },
            { label: '30D', value: '30' },
            { label: '90D', value: '90' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Daily Leads Trend - Real Data */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Daily Leads Trend</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  className="text-sm"
                />
                <YAxis className="text-sm" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="leads_generated"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Generated"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No daily data available
            </div>
          )}
        </div>

        {/* Status Distribution - Real Data */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lead Status Distribution</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          {statusChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} leads`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No status data available
            </div>
          )}
        </div>

        {/* Industry Breakdown - Real Data */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Industry Breakdown</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          {industryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={industryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" className="text-sm" />
                <YAxis dataKey="industry" type="category" width={80} className="text-sm" />
                <Tooltip 
                  formatter={(value) => [`${value} leads`, 'Count']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No industry data available
            </div>
          )}
        </div>

        {/* Lead Score Distribution - Real Data */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lead Score Distribution</h3>
            <Star className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreChartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="range" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip 
                formatter={(value) => [`${value} leads`, 'Count']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geographic Distribution - Real Data */}
      {geoData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Geographic Distribution</h3>
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {geoData.slice(0, 8).map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{location.location}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{location.count} leads</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{location.percentage}%</div>
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Performance Summary</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {overview.avg_lead_score || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Lead Score</div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {overview.leads_this_week || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Leads This Week</div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {overview.total_leads || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Leads Generated</div>
          </div>
        </div>
      </div>
    </div>
  )
}