// src/stores/leads-store.ts
import { create } from 'zustand'
import { leadsApi } from '@/lib/api'

interface Lead {
  id: string
  user_id: string
  request_id?: string
  name: string
  company_name?: string
  email?: string
  phone?: string
  website?: string
  linkedin_url?: string
  city?: string
  country?: string
  industry?: string
  pain_points: string[]
  business_needs?: string[]
  buying_signals?: string[]
  lead_score: number
  source: 'apify' | 'serper' | 'manual' | 'import'
  contact_status: 'not_contacted' | 'contacted' | 'qualified' | 'unqualified' | 'converted'
  notes?: string
  tags?: Tag[]
  created_at: string
  updated_at: string
}

interface Tag {
  id: string
  name: string
  color: string
  lead_count?: number
}

interface GenerationRequest {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  generated_count: number
  requested_count: number
  error_message?: string
}

interface LeadsFilters {
  search: string
  status: string
  industry: string
  source: string
  tags: string[]
  scoreRange: [number, number]
}

interface LeadsState {
  leads: Lead[]
  filteredLeads: Lead[]
  tags: Tag[]
  isLoading: boolean
  error: string | null
  filters: LeadsFilters
  currentGeneration: GenerationRequest | null
  
  // Actions
  loadLeads: () => Promise<void>
  generateLeads: (params: GenerateLeadsParams) => Promise<string>
  checkGenerationStatus: (requestId: string) => Promise<GenerationRequest>
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>
  deleteLead: (id: string) => Promise<void>
  bulkUpdateLeads: (ids: string[], data: Partial<Lead>) => Promise<void>
  bulkDeleteLeads: (ids: string[]) => Promise<void>
  
  // Filtering
  setFilters: (filters: Partial<LeadsFilters>) => void
  clearFilters: () => void
  applyFilters: () => void
  
  // Tags
  loadTags: () => Promise<void>
  createTag: (name: string, color: string) => Promise<void>
  updateTag: (id: string, data: { name: string; color: string }) => Promise<void>
  deleteTag: (id: string) => Promise<void>
  tagLead: (leadId: string, tagId: string) => Promise<void>
  untagLead: (leadId: string, tagId: string) => Promise<void>
  bulkTagLeads: (leadIds: string[], tagId: string) => Promise<void>
}

interface GenerateLeadsParams {
  audience: string
  categories: string[]
  keywords: string[]
  niche: string
  location: string
  requested_count: number
}

const defaultFilters: LeadsFilters = {
  search: '',
  status: 'all',
  industry: 'all',
  source: 'all',
  tags: [],
  scoreRange: [0, 100]
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  filteredLeads: [],
  tags: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,
  currentGeneration: null,

  loadLeads: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await leadsApi.getAll()
      const leads = response.leads || response.data || []
      
      // Only show contactable leads (with email or phone)
      const contactableLeads = leads.filter((lead: Lead) => lead.email || lead.phone)
      
      set({ 
        leads: contactableLeads,
        isLoading: false 
      })
      
      // Apply current filters
      get().applyFilters()
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to load leads',
        isLoading: false 
      })
    }
  },

  generateLeads: async (params: GenerateLeadsParams) => {
    set({ isLoading: true, error: null, currentGeneration: null })
    try {
      const response = await leadsApi.generate(params)
      const requestId = response.request_id || response.id
      
      set({ 
        currentGeneration: {
          id: requestId,
          status: 'processing',
          generated_count: 0,
          requested_count: params.requested_count
        },
        isLoading: false 
      })
      
      return requestId
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to start lead generation',
        isLoading: false 
      })
      throw error
    }
  },

  checkGenerationStatus: async (requestId: string) => {
    try {
      const status = await leadsApi.getGenerationStatus(requestId)
      
      set({ currentGeneration: status })
      
      // If completed, reload leads
      if (status.status === 'completed') {
        await get().loadLeads()
      }
      
      return status
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to check status'
      set({ error: errorMsg })
      throw error
    }
  },

  updateLead: async (id: string, data: Partial<Lead>) => {
    try {
      const updatedLead = await leadsApi.update(id, data)
      
      set(state => ({
        leads: state.leads.map(lead => 
          lead.id === id ? { ...lead, ...updatedLead } : lead
        )
      }))
      
      get().applyFilters()
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update lead' })
      throw error
    }
  },

  deleteLead: async (id: string) => {
    try {
      await leadsApi.delete(id)
      
      set(state => ({
        leads: state.leads.filter(lead => lead.id !== id)
      }))
      
      get().applyFilters()
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete lead' })
      throw error
    }
  },

  bulkUpdateLeads: async (ids: string[], data: Partial<Lead>) => {
    try {
      await Promise.all(ids.map(id => leadsApi.update(id, data)))
      
      set(state => ({
        leads: state.leads.map(lead => 
          ids.includes(lead.id) ? { ...lead, ...data } : lead
        )
      }))
      
      get().applyFilters()
    } catch (error: any) {
      set({ error: 'Failed to update leads' })
      throw error
    }
  },

  bulkDeleteLeads: async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => leadsApi.delete(id)))
      
      set(state => ({
        leads: state.leads.filter(lead => !ids.includes(lead.id))
      }))
      
      get().applyFilters()
    } catch (error: any) {
      set({ error: 'Failed to delete leads' })
      throw error
    }
  },

  setFilters: (newFilters: Partial<LeadsFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }))
    get().applyFilters()
  },

  clearFilters: () => {
    set({ filters: defaultFilters })
    get().applyFilters()
  },

  applyFilters: () => {
    const { leads, filters } = get()
    
    let filtered = leads.filter(lead => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const matchesSearch = 
          lead.name?.toLowerCase().includes(searchTerm) ||
          lead.company_name?.toLowerCase().includes(searchTerm) ||
          lead.email?.toLowerCase().includes(searchTerm)
        
        if (!matchesSearch) return false
      }
      
      // Status filter
      if (filters.status !== 'all' && lead.contact_status !== filters.status) {
        return false
      }
      
      // Industry filter
      if (filters.industry !== 'all' && lead.industry !== filters.industry) {
        return false
      }
      
      // Source filter
      if (filters.source !== 'all' && lead.source !== filters.source) {
        return false
      }
      
      // Tags filter
      if (filters.tags.length > 0) {
        const leadTagIds = lead.tags?.map(tag => tag.id) || []
        const hasRequiredTag = filters.tags.some(tagId => leadTagIds.includes(tagId))
        if (!hasRequiredTag) return false
      }
      
      // Score range filter
      const [minScore, maxScore] = filters.scoreRange
      if (lead.lead_score < minScore || lead.lead_score > maxScore) {
        return false
      }
      
      return true
    })
    
    set({ filteredLeads: filtered })
  },

  loadTags: async () => {
    try {
      const tags = await leadsApi.getTags()
      set({ tags })
    } catch (error: any) {
      set({ error: 'Failed to load tags' })
    }
  },

  createTag: async (name: string, color: string) => {
    try {
      const newTag = await leadsApi.createTag({ name, color })
      set(state => ({ tags: [...state.tags, newTag] }))
    } catch (error: any) {
      set({ error: 'Failed to create tag' })
      throw error
    }
  },

  updateTag: async (id: string, data: { name: string; color: string }) => {
    try {
      const updatedTag = await leadsApi.updateTag(id, data)
      set(state => ({
        tags: state.tags.map(tag => tag.id === id ? updatedTag : tag)
      }))
    } catch (error: any) {
      set({ error: 'Failed to update tag' })
      throw error
    }
  },

  deleteTag: async (id: string) => {
    try {
      await leadsApi.deleteTag(id)
      set(state => ({
        tags: state.tags.filter(tag => tag.id !== id),
        leads: state.leads.map(lead => ({
          ...lead,
          tags: lead.tags?.filter(tag => tag.id !== id)
        }))
      }))
      get().applyFilters()
    } catch (error: any) {
      set({ error: 'Failed to delete tag' })
      throw error
    }
  },

  tagLead: async (leadId: string, tagId: string) => {
    try {
      await leadsApi.tagLead(leadId, tagId)
      const tag = get().tags.find(t => t.id === tagId)
      
      if (tag) {
        set(state => ({
          leads: state.leads.map(lead => 
            lead.id === leadId 
              ? { ...lead, tags: [...(lead.tags || []), tag] }
              : lead
          )
        }))
        get().applyFilters()
      }
    } catch (error: any) {
      set({ error: 'Failed to tag lead' })
      throw error
    }
  },

  untagLead: async (leadId: string, tagId: string) => {
    try {
      await leadsApi.untagLead(leadId, tagId)
      
      set(state => ({
        leads: state.leads.map(lead => 
          lead.id === leadId 
            ? { ...lead, tags: lead.tags?.filter(tag => tag.id !== tagId) }
            : lead
        )
      }))
      get().applyFilters()
    } catch (error: any) {
      set({ error: 'Failed to untag lead' })
      throw error
    }
  },

  bulkTagLeads: async (leadIds: string[], tagId: string) => {
    try {
      await Promise.all(leadIds.map(leadId => leadsApi.tagLead(leadId, tagId)))
      const tag = get().tags.find(t => t.id === tagId)
      
      if (tag) {
        set(state => ({
          leads: state.leads.map(lead => 
            leadIds.includes(lead.id)
              ? { ...lead, tags: [...(lead.tags || []), tag] }
              : lead
          )
        }))
        get().applyFilters()
      }
    } catch (error: any) {
      set({ error: 'Failed to tag leads' })
      throw error
    }
  }
}))