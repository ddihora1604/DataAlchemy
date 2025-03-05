"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Database, History, Home, BookOpen, Brain, User, ChevronLeft, ChevronRight, Beaker } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Generation History", href: "/generated-data", icon: Database },
  { name: "Numerical Analysis", href: "/analysis", icon: BarChart2 },
  { name: "Data Insights", href: "/insights", icon: Brain },
  { name: "Machine Learning", href: "/ml", icon: BookOpen },
  { name: "Model Information", href: "/models", icon: Beaker },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "relative flex flex-col border-r bg-card",
      isCollapsed ? "w-[4rem]" : "w-64",
      "transition-all duration-300 ease-in-out"
    )}>
      <div className="flex h-40 items-center border-b px-4 justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Image
            src="/DataAlchemy Logo.png"
            alt="DataAlchemy Logo"
            width={500}
            height={500}
            className="shrink-0"
            priority
          />
          {/* <h1 className={cn(
            "font-semibold tracking-tight whitespace-nowrap",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto",
            "transition-all duration-300 ease-in-out"
          )}>
            DataAlchemy
          </h1> */}
        </div>
        {/* <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button> */}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="grid gap-1 px-2 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href ? "bg-accent" : "transparent",
                  "group"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={cn(
                  "whitespace-nowrap overflow-hidden",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                  "transition-all duration-300 ease-in-out"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-2 hover:bg-accent/50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <div className="mt-auto border-t p-4 cursor-pointer hover:bg-accent transition-colors">
              
              <div className="flex items-center gap-3 overflow-hidden">
                
                <Avatar className="shrink-0">
                  <AvatarImage src="https://t3.ftcdn.net/jpg/03/26/84/88/360_F_326848805_qtf1DQC7b5IOsOw0f4PhUV5ubr3W7Oho.jpg" />
                  <AvatarFallback>DA</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "overflow-hidden",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                  "transition-all duration-300 ease-in-out"
                )}>
                  <p className="text-sm font-medium truncate">Darshan Dihora</p>
                  <p className="text-xs text-muted-foreground truncate">darshan.dihora@djsce.edu.in</p>
                </div>
              </div>
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Profile</SheetTitle>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://t3.ftcdn.net/jpg/03/26/84/88/360_F_326848805_qtf1DQC7b5IOsOw0f4PhUV5ubr3W7Oho.jpg" />
                    <AvatarFallback>DA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-base font-medium">Darshan Dihora</h4>
                    <p className="text-sm text-muted-foreground">AI Enthusiast</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Email:</strong> darshan.dihora@djsce.edu.in</p>
                  <p className="text-sm"><strong>Role:</strong> Third-year B. Tech Student</p>
                  <p className="text-sm"><strong>Department:</strong> Artificial Intelligence and Data Science</p>
                  <p className="text-sm"><strong>Organization:</strong> SVKM's Dwarkadas J. Sanghvi College of Engineering</p>
                  <p className="text-sm"><strong>Location:</strong> Mumbai, Maharashtra, India</p>
                  <p className="text-sm"><strong>Joined:</strong> December 2022</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}