// src/components/layout/sidebar.tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Users,
  Zap,
  Mail,
  Tag,
  Settings,
  Import,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Generate Leads',
    href: '/generate',
    icon: Zap,
  },
  {
    name: 'Leads',
    href: '/leads',
    icon: Users,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Campaigns',
    href: '/campaigns',
    icon: Mail,
  },
  {
    name: 'Tags',
    href: '/tags',
    icon: Tag,
  },
  {
    name: 'Import/Export',
    href: '/import-export',
    icon: Import,
  },
  {
    name: 'Pricing',
    href: '/pricing',
    icon: CreditCard,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuthStore()

  return (
    <div
      className={cn(
        'flex h-screen flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">XcapeLeads</h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const isPricing = item.name === 'Pricing'
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-3 text-base font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : isPricing
                  ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                collapsed && 'justify-center'
              )}
            >
              <Icon className={cn('h-6 w-6', !collapsed && 'mr-3')} />
              {!collapsed && (
                <span className="flex items-center justify-between w-full">
                  {item.name}
                  {isPricing && user?.subscription_plan !== 'enterprise' && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      Upgrade
                    </span>
                  )}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Plan Status in Sidebar */}
      {!collapsed && user && (
        <div className="border-t p-4 space-y-3">
          <div className="text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600 dark:text-gray-400">Current Plan</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {user.subscription_plan || 'free'}
              </span>
            </div>
            {user.leads_quota && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Leads Used</span>
                  <span>{user.leads_used || 0}/{user.leads_quota}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(((user.leads_used || 0) / user.leads_quota) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t p-4">
        <div className={cn('text-sm text-gray-500 dark:text-gray-400', collapsed && 'text-center')}>
          {collapsed ? '©' : '© 2025 LeadsGen'}
        </div>
      </div>
    </div>
  )
}