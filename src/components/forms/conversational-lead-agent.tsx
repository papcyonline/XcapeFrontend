"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { leadsApi } from '@/lib/api'

interface Message {
  id: string
  role: 'agent' | 'user'
  content: string
  timestamp: Date
}

interface LeadParams {
  audience?: string
  categories?: string[]
  keywords?: string[]
  niche?: string
  location?: string
  requested_count?: number
}

interface GenerationStatus {
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress?: number
  message?: string
  job_id?: string
  leads_count?: number
  error_message?: string
}

const questions = [
  {
    key: 'audience',
    question: "Hi! What type of companies are you looking for?"
  },
  {
    key: 'niche',
    question: "What industry? (e.g., Software, Healthcare, Marketing)"
  },
  {
    key: 'keywords', 
    question: "Keywords to search for? (separate with commas)"
  },
  {
    key: 'location',
    question: "Which location? (e.g., San Francisco, CA)"
  },
  {
    key: 'requested_count',
    question: "How many leads? (1-100)"
  }
]

export default function ConversationalLeadAgent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [leadParams, setLeadParams] = useState<LeadParams>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const statusPollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (messages.length === 0) {
      addAgentMessage(questions[0].question)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (statusPollingRef.current) {
        clearInterval(statusPollingRef.current)
      }
    }
  }, [])

  const addAgentMessage = (content: string, withTyping: boolean = true) => {
    if (withTyping) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages((prev: Message[]) => [...prev, {
          id: Date.now().toString(),
          role: 'agent',
          content,
          timestamp: new Date()
        }])
        setIsTyping(false)
      }, 1000)
    } else {
      setMessages((prev: Message[]) => [...prev, {
        id: Date.now().toString(),
        role: 'agent',
        content,
        timestamp: new Date()
      }])
    }
  }

const updateLastAgentMessage = (content: string) => {
  setMessages((prev: Message[]) => {
    const newMessages = [...prev]
    // Find the last agent message by iterating backwards
    let lastAgentIndex = -1
    for (let i = newMessages.length - 1; i >= 0; i--) {
      if (newMessages[i].role === 'agent') {
        lastAgentIndex = i
        break
      }
    }
    
    if (lastAgentIndex !== -1) {
      newMessages[lastAgentIndex] = {
        ...newMessages[lastAgentIndex],
        content,
        timestamp: new Date()
      }
    }
    return newMessages
  })
}

  const addUserMessage = (content: string) => {
    setMessages((prev: Message[]) => [...prev, {
      id: Date.now().toString(),
      role: 'user', 
      content,
      timestamp: new Date()
    }])
  }

  const pollGenerationStatus = async (jobId: string) => {
    try {
      const status: GenerationStatus = await leadsApi.getJobStatus(jobId)
      
      setGenerationStatus(status)

      switch (status.status) {
        case 'in_progress':
          const progressMessage = `🔄 ${status.message || 'Generating leads...'} ${status.progress || 0}% complete`
          updateLastAgentMessage(progressMessage)
          break
          
        case 'completed':
          if (statusPollingRef.current) {
            clearInterval(statusPollingRef.current)
          }
          setIsGenerating(false)
          setIsComplete(true)
          updateLastAgentMessage(`🎉 Success! I've generated ${status.leads_count || 'your'} leads. You can now view them in your leads dashboard. Would you like to generate more leads?`)
          break
          
        case 'failed':
          if (statusPollingRef.current) {
            clearInterval(statusPollingRef.current)
          }
          setIsGenerating(false)
          updateLastAgentMessage(`❌ Sorry, lead generation failed: ${status.error_message || 'Unknown error'}. Please try again.`)
          break
      }
    } catch (error) {
      console.error('Error polling status:', error)
      // Continue polling unless it's a critical error
    }
  }

  const startStatusPolling = (jobId: string) => {
    // Poll every 2 seconds
    statusPollingRef.current = setInterval(() => {
      pollGenerationStatus(jobId)
    }, 2000)
    
    // Initial status check
    pollGenerationStatus(jobId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim()) return

    addUserMessage(currentInput)
    const userInput = currentInput.trim()
    setCurrentInput('')

    const questionKey = questions[currentQuestion].key
    let processedInput: any = userInput

    if (questionKey === 'keywords') {
      processedInput = userInput.split(',').map((k: string) => k.trim()).filter((k: string) => k)
    } else if (questionKey === 'requested_count') {
      processedInput = parseInt(userInput) || 10
    }

    const updatedParams = { ...leadParams, [questionKey]: processedInput }
    setLeadParams(updatedParams)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        addAgentMessage(questions[currentQuestion + 1].question)
        setCurrentQuestion(currentQuestion + 1)
      }, 1500)
    } else {
      setTimeout(() => {
        showSummary(updatedParams)
      }, 1500)
    }
  }

  const showSummary = (params: LeadParams) => {
    const summary = `Ready to generate:
• ${params.audience}
• Industry: ${params.niche}
• Keywords: ${params.keywords?.join(', ')}
• Location: ${params.location}
• Count: ${params.requested_count}

Type 'yes' to start or 'no' to restart.`

    addAgentMessage(summary)
    setCurrentQuestion(-1)
  }

  const handleConfirmation = async (input: string) => {
    if (input.toLowerCase().includes('yes')) {
      addUserMessage(input)
      setIsGenerating(true)
      setGenerationStatus(null)
      
      try {
        addAgentMessage("🚀 Starting lead generation process...", false)
        
        const requestData = {
          audience: leadParams.audience || '',
          categories: leadParams.categories || [],
          keywords: leadParams.keywords || [],
          niche: leadParams.niche || '',
          location: leadParams.location || '',
          requested_count: leadParams.requested_count || 10
        }
        
        // Use the new job-based API
        const response = await leadsApi.generateJob(requestData)
        
        if (response.job_id) {
          setJobId(response.job_id)
          startStatusPolling(response.job_id)
        } else {
          // Fallback for immediate response (if your API doesn't use job system)
          setIsComplete(true)
          setIsGenerating(false)
          updateLastAgentMessage("🎉 Success! I've generated your leads. You can now view them in your leads dashboard. Would you like to generate more leads?")
        }
        
      } catch (error: any) {
        setIsGenerating(false)
        addAgentMessage(`❌ Sorry, I encountered an error: ${error.response?.data?.error || error.message || 'Failed to generate leads'}. Please try again.`, false)
      }
    } else if (input.toLowerCase().includes('no')) {
      addUserMessage(input)
      resetConversation()
    }
  }

  const resetConversation = () => {
    // Clear any ongoing polling
    if (statusPollingRef.current) {
      clearInterval(statusPollingRef.current)
    }
    
    setMessages([])
    setCurrentQuestion(0)
    setLeadParams({})
    setIsComplete(false)
    setIsGenerating(false)
    setGenerationStatus(null)
    setJobId(null)
    
    setTimeout(() => {
      addAgentMessage(questions[0].question)
    }, 500)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim()) return

    if (currentQuestion === -1) {
      handleConfirmation(currentInput)
      setCurrentInput('')
    } else if (isComplete) {
      if (currentInput.toLowerCase().includes('yes')) {
        addUserMessage(currentInput)
        resetConversation()
      } else {
        addUserMessage(currentInput)
        addAgentMessage("Thanks for using the lead generation assistant! Feel free to start a new conversation anytime.")
      }
      setCurrentInput('')
    } else {
      handleSubmit(e)
    }
  }

  const getStatusIcon = () => {
    if (!generationStatus) return <Loader2 className="w-4 h-4 animate-spin" />
    
    switch (generationStatus.status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'in_progress':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Loader2 className="w-4 h-4 animate-spin" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lead Generation Assistant
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered lead discovery
            </p>
          </div>
          {isGenerating && (
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {generationStatus?.status === 'in_progress' 
                  ? `${generationStatus.progress || 0}%` 
                  : 'Processing...'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === 'agent' && (
                  <Bot className="w-4 h-4 mt-1 text-blue-600" />
                )}
                {message.role === 'user' && (
                  <User className="w-4 h-4 mt-1" />
                )}
                <div className="whitespace-pre-line">{message.content}</div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Progress Bar for Generation */}
      {isGenerating && generationStatus?.status === 'in_progress' && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-sm text-blue-700 dark:text-blue-300 mb-1">
            <span>Generating leads...</span>
            <span>{generationStatus.progress || 0}%</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${generationStatus.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      {isComplete && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Lead generation completed successfully!</span>
            <button
              onClick={() => window.location.href = '/leads'}
              className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              View Leads
            </button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleInputSubmit} className="flex gap-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={isGenerating ? "Generating leads..." : "Type your response..."}
            disabled={isGenerating || isTyping}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isGenerating || isTyping || !currentInput.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}