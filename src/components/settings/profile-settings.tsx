// Profile Settings Component - FIXED VERSION
"use client"

import { useState, useEffect, useRef } from 'react'
import { User, Building, Mail, Save, Camera, Upload } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { userApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'

export function ProfileSettings() {
  const { user, setUser } = useAuthStore()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company_name: '',
    phone: '',
    bio: '',
    timezone: 'UTC-8',
    avatar_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load user data when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Always fetch fresh data from the API
        const response = await userApi.getProfile()
        const userData = response.data
        
        setFormData({
          full_name: userData.full_name || '',
          email: userData.email || '',
          company_name: userData.company_name || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          timezone: userData.timezone || 'UTC-8',
          avatar_url: userData.avatar_url || ''
        })
      } catch (error) {
        console.error('Failed to load profile:', error)
        // Fallback to auth store data
        if (user) {
          setFormData({
            full_name: user.full_name || '',
            email: user.email || '',
            company_name: user.company_name || '',
            phone: user.phone || '',
            bio: user.bio || '',
            timezone: user.timezone || 'UTC-8',
            avatar_url: user.avatar_url || ''
          })
        }
      }
    }
    
    loadUserProfile()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Call actual API to update profile
      await userApi.updateProfile(formData)
      
      // Reload fresh data from the API
      const response = await userApi.getProfile()
      const userData = response.data
      
      // Update form with fresh data
      setFormData({
        full_name: userData.full_name || '',
        email: userData.email || '',
        company_name: userData.company_name || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        timezone: userData.timezone || 'UTC-8',
        avatar_url: userData.avatar_url || ''
      })
      
      // Update auth store
      setUser({
        ...user!,
        ...userData
      })
      
      alert('Profile updated successfully!')
    } catch (error: any) {
      console.error('Profile update failed:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB')
      return
    }

    setUploading(true)
    try {
      console.log('Uploading file:', file.name, file.size, file.type)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}/avatar.${fileExt}`
      
      console.log('Upload path:', fileName)

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error('Storage upload error:', error)
        throw error
      }

      console.log('Upload successful:', data)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      console.log('Public URL:', publicUrl)

      // Update form data with new avatar URL
      setFormData({ ...formData, avatar_url: publicUrl })

    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
        <p className="text-gray-600 dark:text-gray-300">Update your personal information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center overflow-hidden">
              {formData.avatar_url ? (
                <img 
                  src={formData.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <button
              type="button"
              onClick={triggerFileUpload}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-1.5 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Upload className="h-4 w-4 text-gray-600 dark:text-gray-300 animate-spin" />
              ) : (
                <Camera className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Profile Photo</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              JPG, PNG or GIF. Max 2MB.
              {uploading && <span className="text-blue-600"> Uploading...</span>}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name
            </label>
            <input
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timezone
          </label>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="UTC-12">UTC-12 (Baker Island)</option>
            <option value="UTC-8">UTC-8 (Pacific Time)</option>
            <option value="UTC-5">UTC-5 (Eastern Time)</option>
            <option value="UTC+0">UTC+0 (London)</option>
            <option value="UTC+1">UTC+1 (Paris)</option>
            <option value="UTC+9">UTC+9 (Tokyo)</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}