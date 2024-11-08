import React from 'react'
import '.././globals.css'
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth bg-[url('/images/bg-auth.png')] bg-cover bg-no-repeat bg-center min-h-screen flex items-center justify-center">
        {children}
    </main>
  )
}

export default Layout