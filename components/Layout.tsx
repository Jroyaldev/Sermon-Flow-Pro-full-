import React from 'react'

type LayoutProps = {
  leftSidebar: React.ReactNode
  rightSidebar: React.ReactNode
  children: React.ReactNode
  mainClassName?: string // New prop
}

const Layout: React.FC<LayoutProps> = ({ leftSidebar, rightSidebar, children, mainClassName }) => {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block w-64">{leftSidebar}</aside>
      <main className={`flex-grow ${mainClassName || ''}`}>{children}</main>
      <aside className="hidden md:block w-64">{rightSidebar}</aside>
    </div>
  )
}

export default Layout