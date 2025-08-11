"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Users, Hash, X } from 'lucide-react'

interface Tag {
  id: string
  name: string
  color: string
  lead_count: number
  created_at: string
}

const mockTags: Tag[] = [
  { id: '1', name: 'Hot Lead', color: '#EF4444', lead_count: 23, created_at: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Enterprise', color: '#8B5CF6', lead_count: 45, created_at: '2024-01-14T14:20:00Z' },
  { id: '3', name: 'Startup', color: '#10B981', lead_count: 67, created_at: '2024-01-13T09:15:00Z' },
  { id: '4', name: 'Cold Outreach', color: '#3B82F6', lead_count: 89, created_at: '2024-01-12T16:45:00Z' },
  { id: '5', name: 'Follow-up', color: '#F59E0B', lead_count: 34, created_at: '2024-01-11T11:20:00Z' },
  { id: '6', name: 'Decision Maker', color: '#EC4899', lead_count: 12, created_at: '2024-01-10T08:30:00Z' }
]

const colorOptions = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
  '#6B7280', '#059669', '#DC2626', '#7C3AED', '#DB2777', '#0891B2'
]

export function TagsManager() {
  const [tags, setTags] = useState(mockTags)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [formData, setFormData] = useState({ name: '', color: colorOptions[0] })

  const createTag = () => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name: formData.name,
      color: formData.color,
      lead_count: 0,
      created_at: new Date().toISOString()
    }
    setTags([newTag, ...tags])
    setFormData({ name: '', color: colorOptions[0] })
    setShowCreateModal(false)
  }

  const updateTag = () => {
    if (!editingTag) return
    setTags(tags.map(tag => 
      tag.id === editingTag.id 
        ? { ...tag, name: formData.name, color: formData.color }
        : tag
    ))
    setEditingTag(null)
    setFormData({ name: '', color: colorOptions[0] })
  }

  const deleteTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId))
  }

  const openEditModal = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({ name: tag.name, color: tag.color })
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingTag(null)
    setFormData({ name: '', color: colorOptions[0] })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tags Management</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {tags.length} tags • {tags.reduce((sum, tag) => sum + tag.lead_count, 0)} tagged leads
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Tag
        </button>
      </div>

      {/* Tags Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">{tag.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(tag)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteTag(tag.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{tag.lead_count} leads</span>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
              Created {new Date(tag.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}

        {/* Create New Tag Card */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <Plus className="h-8 w-8 mb-2" />
            <span className="font-medium">Create New Tag</span>
          </div>
        </button>
      </div>

      {tags.length === 0 && (
        <div className="text-center py-12">
          <Hash className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tags yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first tag to start organizing your leads
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Tag
          </button>
        </div>
      )}

      {/* Create/Edit Tag Modal */}
      {(showCreateModal || editingTag) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingTag ? 'Edit Tag' : 'Create New Tag'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter tag name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tag Color
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({...formData, color})}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color 
                          ? 'border-gray-900 dark:border-white scale-110' 
                          : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.name || 'Tag Name'}
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTag ? updateTag : createTag}
                  disabled={!formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingTag ? 'Update Tag' : 'Create Tag'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}