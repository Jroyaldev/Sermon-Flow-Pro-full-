import React from 'react'

type LayoutProps = {
  leftSidebar: React.ReactNode
  rightSidebar: React.ReactNode
  children: React.ReactNode
  mainClassName?: string // New prop
}

export default function Layout({ 
  leftSidebar, 
  rightSidebar, 
  children, 
  mainClassName 
}: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 h-full relative">
        {leftSidebar}
      </div>
      <main className={`flex-1 overflow-auto ${mainClassName}`}>
        {children}
      </main>
      <div className="w-64 h-full">
        {rightSidebar}
      </div>
    </div>
  )
}