// src/types/analytics.ts
export interface AnalyticsOverview {
  total_leads: number
  leads_this_month: number
  conversion_rate: number
  quota_usage_percentage: number
  average_lead_score: number
}

export interface StatusDistribution {
  status: string
  count: number
  percentage: number
}

export interface SourceBreakdown {
  source: string
  count: number
  percentage: number
}

export interface IndustryBreakdown {
  industry: string
  count: number
  percentage: number
}

export interface DailyStats {
  date: string
  leads_generated: number
  leads_contacted: number
  leads_converted: number
}

export interface GeographicDistribution {
  city: string
  country: string
  count: number
  percentage: number
}

export interface ScoreDistribution {
  score_range: string
  count: number
  percentage: number
}

export interface RecentActivity {
  id: string
  type: 'lead_generated' | 'lead_contacted' | 'lead_converted' | 'campaign_sent'
  description: string
  timestamp: string
  lead_id?: string
}