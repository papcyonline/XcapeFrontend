// src/types/leads.ts
export interface Lead {
  id: string
  name: string
  company_name?: string
  email?: string
  phone?: string
  website?: string
  city?: string
  industry?: string
  pain_points: string[]
  lead_score: number
  source: string
  contact_status: 'not_contacted' | 'contacted' | 'qualified' | 'unqualified' | 'converted'
  tags?: Tag[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  color: string
  lead_count: number
  created_at: string
}

export interface LeadGenerationRequest {
  audience: string
  categories: string[]
  keywords: string[]
  niche: string
  location: string
  requested_count: number
}

export interface LeadGenerationStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  total_requested: number
  total_generated: number
  message?: string
  created_at: string
}

export interface LeadsFilters {
  search?: string
  status?: string
  industry?: string
  source?: string
  tags?: string[]
  score_min?: number
  score_max?: number
  page?: number
  limit?: number
}

export interface LeadsResponse {
  leads: Lead[]
  total: number
  page: number
  limit: number
  pages: number
}