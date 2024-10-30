import React from 'react'
import '.././globals.css'
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth">
      {children}
    </main>
  )
}

export default Layout