// src/app/(dashboard)/pricing/page.tsx
"use client"

import { useState } from 'react'
import { Check, Zap, Crown, Building, Star, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 0,
    priceId: null,
    period: 'Forever',
    description: 'Perfect for getting started',
    icon: <Star className="h-6 w-6" />,
    color: 'border-gray-200 dark:border-gray-700',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
    popular: false,
    features: [
      '100 AI-generated leads',
      'Basic lead scoring',
      'Email & phone contact info',
      'CSV export',
      'Standard support',
    ],
    limits: {
      leads: 100,
      exports: 5,
      campaigns: 2,
    }
  },
  {
    name: 'Starter',
    price: 29,
    priceId: 'price_starter', // Replace with your actual Stripe price ID
    period: 'month',
    description: 'Best for small businesses',
    icon: <Zap className="h-6 w-6" />,
    color: 'border-blue-500 ring-2 ring-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    popular: true,
    features: [
      '1,000 AI-generated leads',
      'Advanced lead scoring',
      'Email & phone contact info',
      'Unlimited CSV/Excel exports',
      'Email campaigns (5/month)',
      'Industry targeting',
      'Priority support',
    ],
    limits: {
      leads: 1000,
      exports: 'unlimited',
      campaigns: 5,
    }
  },
  {
    name: 'Professional',
    price: 79,
    priceId: 'price_professional', // Replace with your actual Stripe price ID
    period: 'month',
    description: 'For growing teams',
    icon: <Crown className="h-6 w-6" />,
    color: 'border-purple-500',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    popular: false,
    features: [
      '5,000 AI-generated leads',
      'Premium lead scoring',
      'Email & phone contact info',
      'Unlimited exports',
      'Unlimited email campaigns',
      'Advanced filtering',
      'LinkedIn profile matching',
      'CRM integrations',
      'Analytics dashboard',
      'Premium support',
    ],
    limits: {
      leads: 5000,
      exports: 'unlimited',
      campaigns: 'unlimited',
    }
  },
  {
    name: 'Enterprise',
    price: 199,
    priceId: 'price_enterprise', // Replace with your actual Stripe price ID
    period: 'month',
    description: 'For large organizations',
    icon: <Building className="h-6 w-6" />,
    color: 'border-gold-500',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    popular: false,
    features: [
      '20,000 AI-generated leads',
      'Enterprise lead scoring',
      'Email & phone contact info',
      'Unlimited exports',
      'Unlimited email campaigns',
      'Advanced filtering & search',
      'LinkedIn profile matching',
      'Full CRM integrations',
      'Advanced analytics',
      'Custom API access',
      'Dedicated account manager',
      'White-label options',
    ],
    limits: {
      leads: 20000,
      exports: 'unlimited',
      campaigns: 'unlimited',
    }
  }
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const { user } = useAuthStore()
  const currentPlan = user?.subscription_plan || 'free'

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === 'yearly' ? Math.round(price * 0.8) : price // 20% off yearly
  }

  const getPlanButtonText = (planName: string) => {
    const planKey = planName.toLowerCase()
    if (currentPlan === planKey) {
      return 'Current Plan'
    }
    if (planKey === 'free') {
      return 'Downgrade'
    }
    return 'Upgrade Now'
  }

  const isPlanDisabled = (planName: string) => {
    return currentPlan === planName.toLowerCase()
  }

  const handleUpgrade = async (plan: any) => {
    if (plan.priceId === null) {
      alert('Contact support to downgrade to free plan')
      return
    }

    setLoadingPlan(plan.name)
    
    try {
      // For now, just show an alert - we'll implement Stripe later
      alert(`Upgrading to ${plan.name} plan - Payment integration coming soon!`)
    } catch (error: any) {
      console.error('Payment failed:', error)
      alert(`Payment failed: ${error.message}`)
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleManageBilling = async () => {
    alert('Billing portal coming soon!')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Scale your lead generation with AI-powered tools
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingPeriod === 'yearly' && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Save 20%
            </span>
          )}
        </div>
      </div>

      {/* Current Plan Status */}
      {user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
          <p className="text-blue-800 dark:text-blue-200">
            You're currently on the <strong className="capitalize">{currentPlan}</strong> plan
            {user.leads_used !== undefined && user.leads_quota && (
              <span className="ml-2">
                ({user.leads_used}/{user.leads_quota} leads used)
              </span>
            )}
          </p>
          {currentPlan !== 'free' && (
            <button
              onClick={handleManageBilling}
              className="mt-2 text-sm text-blue-600 hover:text-blue-500 underline"
            >
              Manage Billing & Subscription
            </button>
          )}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 ${plan.color} p-6 ${
              plan.popular ? 'scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                plan.name === 'Free' ? 'bg-gray-100 text-gray-600' :
                plan.name === 'Starter' ? 'bg-blue-100 text-blue-600' :
                plan.name === 'Professional' ? 'bg-purple-100 text-purple-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                {plan.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {plan.description}
              </p>

              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${plan.price === 0 ? '0' : getDiscountedPrice(plan.price)}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-500 ml-1">
                    /{billingPeriod === 'yearly' ? 'year' : plan.period}
                  </span>
                )}
                {billingPeriod === 'yearly' && plan.price > 0 && (
                  <div className="text-sm text-gray-500 line-through">
                    ${plan.price * 12}/year
                  </div>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan)}
              disabled={isPlanDisabled(plan.name) || loadingPlan === plan.name}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                isPlanDisabled(plan.name)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : `${plan.buttonColor} text-white`
              }`}
            >
              {loadingPlan === plan.name ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {loadingPlan === plan.name ? 'Processing...' : getPlanButtonText(plan.name)}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What happens when I reach my lead limit?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              You'll be prompted to upgrade your plan. You can still access existing leads but won't be able to generate new ones until you upgrade or wait for your monthly quota to reset.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I change plans anytime?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Do unused leads roll over?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              No, lead quotas reset monthly. We recommend using your full quota each month to maximize value.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Is there a setup fee?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              No setup fees! You only pay the monthly or yearly subscription price. Cancel anytime with no hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-500"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}