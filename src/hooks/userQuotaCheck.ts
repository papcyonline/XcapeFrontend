// src/hooks/useQuotaCheck.ts
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'

export function useQuotaCheck() {
  const { user } = useAuthStore()
  const router = useRouter()

  const checkQuota = (requestedCount: number = 1): boolean => {
    if (!user) return false

    const currentUsage = user.leads_used || 0
    const quota = user.leads_quota || 100
    const wouldExceed = (currentUsage + requestedCount) > quota

    if (wouldExceed) {
      const remaining = Math.max(0, quota - currentUsage)
      
      if (remaining === 0) {
        // Already at limit
        showUpgradePrompt('You have reached your lead generation limit.')
      } else {
        // Would exceed with this request
        showUpgradePrompt(
          `This would exceed your quota. You have ${remaining} leads remaining. ` +
          `Consider upgrading for unlimited leads.`
        )
      }
      return false
    }

    return true
  }

  const showUpgradePrompt = (message: string) => {
    const shouldUpgrade = window.confirm(
      `${message}\n\nWould you like to upgrade your plan now?`
    )
    
    if (shouldUpgrade) {
      router.push('/pricing')
    }
  }

  const getQuotaStatus = () => {
    if (!user) return { usage: 0, quota: 100, percentage: 0, isNearLimit: false, isOverLimit: false }

    const usage = user.leads_used || 0
    const quota = user.leads_quota || 100
    const percentage = (usage / quota) * 100

    return {
      usage,
      quota,
      percentage,
      remaining: Math.max(0, quota - usage),
      isNearLimit: percentage >= 80,
      isOverLimit: percentage >= 100,
    }
  }

  return {
    checkQuota,
    getQuotaStatus,
    showUpgradePrompt,
  }
}