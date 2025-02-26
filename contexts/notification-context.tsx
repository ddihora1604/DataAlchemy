"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

type NotificationType = 'action' | 'recommendation' | 'insight' | 'alert'

type Notification = {
  id: number
  title: string
  description: string
  time: string
  unread: boolean
  type: NotificationType
}

type NotificationContextType = {
  notifications: Notification[]
  addNotification: (title: string, description: string, type: NotificationType) => void
  markAsRead: (id: number) => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const recommendations = [
  {
    title: "Try VAE Model",
    description: "Based on your data structure, VAE might provide better results for continuous variables.",
    type: "recommendation"
  },
  {
    title: "Data Quality Check",
    description: "It's been a while since your last data quality assessment. Consider running an analysis.",
    type: "recommendation"
  },
  {
    title: "Model Performance Insight",
    description: "Your GAN model shows improved accuracy with larger batch sizes. Consider adjusting parameters.",
    type: "insight"
  },
  {
    title: "Feature Engineering",
    description: "Consider adding polynomial features to capture non-linear relationships in your data.",
    type: "recommendation"
  },
  {
    title: "Data Privacy Tip",
    description: "Enable differential privacy settings for sensitive data generation.",
    type: "recommendation"
  },
  {
    title: "Performance Optimization",
    description: "Using batch size of 128 could improve your model's training speed.",
    type: "insight"
  },
  {
    title: "Data Preprocessing",
    description: "Normalize your numerical columns to improve model convergence.",
    type: "recommendation"
  },
  {
    title: "Model Selection",
    description: "For time-series data, consider using a specialized GAN architecture.",
    type: "insight"
  },
  {
    title: "Training Strategy",
    description: "Progressive growing can help stabilize GAN training for complex datasets.",
    type: "recommendation"
  },
  {
    title: "Resource Management",
    description: "Consider cleaning up old generated datasets to free up storage space.",
    type: "recommendation"
  }
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [lastRecommendationTime, setLastRecommendationTime] = useState(Date.now())

  const addNotification = useCallback((
    title: string, 
    description: string, 
    type: NotificationType
  ) => {
    const newNotification: Notification = {
      id: Date.now() + Math.random(), // Ensure unique ID
      title,
      description,
      time: new Date().toLocaleTimeString(),
      unread: true,
      type
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  // Random recommendations
  useEffect(() => {
    const scheduleNextRecommendation = () => {
      // Increase delays significantly
      const minDelay = 5 * 60 * 1000  // 5 minutes minimum
      const maxDelay = 15 * 60 * 1000 // 15 minutes maximum
      const delay = Math.random() * (maxDelay - minDelay) + minDelay

      setTimeout(() => {
        const now = Date.now()
        // Increase cooldown period to 3 minutes
        if (now - lastRecommendationTime > 3 * 60 * 1000) {
          const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)]
          // 30% chance of showing a recommendation
          if (Math.random() < 0.3) {
            addNotification(
              randomRec.title, 
              randomRec.description, 
              randomRec.type as NotificationType
            )
            setLastRecommendationTime(now)
          }
        }
        scheduleNextRecommendation()
      }, delay)
    }

    scheduleNextRecommendation()

    return () => {
      // Cleanup handled by React
    }
  }, [addNotification, lastRecommendationTime])

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    )
  }, [])

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      markAsRead,
      clearNotifications: () => setNotifications([])
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 