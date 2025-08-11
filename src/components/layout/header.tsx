// src/components/layout/header.tsx
"use client"

import { Search, Bell, User, LogOut, Crown, Settings, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from './theme-toggle'
import { useAuthStore } from '@/stores/auth-store'
import { getInitials } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const planColors = {
  free: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  starter: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  professional: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  enterprise: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
}

const planNames = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise'
}

export function Header() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const currentPlan = user?.subscription_plan || 'free'
  const planName = planNames[currentPlan as keyof typeof planNames] || 'Free'
  const planColor = planColors[currentPlan as keyof typeof planColors] || planColors.free

  const canUpgrade = currentPlan !== 'enterprise'

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-gray-800 px-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search leads, campaigns..."
            className="w-80 pl-10 text-base"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Current Plan Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${planColor} flex items-center gap-1`}>
          {currentPlan === 'enterprise' && <Crown className="h-3 w-3" />}
          {planName} Plan
        </div>

        <ThemeToggle />
       
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-600 text-white text-base font-medium">
                  {user?.full_name ? getInitials(user.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">
                    {user?.full_name}
                  </p>
                  <p className="text-sm leading-none text-gray-600 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                
                {/* Plan Info in Dropdown */}
                <div className="flex items-center justify-between">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${planColor}`}>
                    {planName} Plan
                  </div>
                  {user?.leads_quota && (
                    <div className="text-xs text-gray-500">
                      {user.leads_used || 0}/{user.leads_quota} leads
                    </div>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => router.push('/settings')} className="text-base">
              <User className="mr-2 h-4 w-4" />
              <span>Profile & Settings</span>
            </DropdownMenuItem>
            
            {canUpgrade && (
              <DropdownMenuItem onClick={() => router.push('/pricing')} className="text-base">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Upgrade Plan</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => router.push('/pricing')} className="text-base">
              <Settings className="mr-2 h-4 w-4" />
              <span>Billing & Usage</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout} className="text-base text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}