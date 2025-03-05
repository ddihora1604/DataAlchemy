"use client"

import { usePathname } from "next/navigation"
import { NotificationButton } from "@/components/notification-button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { motion } from "framer-motion"

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Synthetic Numerical Data Generator'
    case '/generated-data':
      return 'Synthetic Data Generation History'
    case '/analysis':
      return 'Statistical Analysis and Visualizations'
    case '/insights':
      return 'Exploratory Data Analysis'
    case '/ml':
      return 'Machine Learning Utility'
    case '/models':
      return 'Gaussian Mixture Model (GMM) Overview'
    default:
      return 'DataAlchemy'
  }
}

export default function Header() {
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xl md:text-2xl font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {getPageTitle(pathname)}
        </motion.button>
        <div className="flex items-center space-x-3">
          <NotificationButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}