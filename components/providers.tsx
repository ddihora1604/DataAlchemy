"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { NotificationProvider } from "@/contexts/notification-context"
import dynamic from 'next/dynamic'
import { Toaster } from "@/components/ui/sonner"

const Sidebar = dynamic(() => import('@/components/sidebar'), {
  loading: () => <div className="w-64 bg-background border-r" />
})

const Header = dynamic(() => import('@/components/header'), {
  loading: () => <div className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NotificationProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-background">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </NotificationProvider>
    </NextThemesProvider>
  )
} 