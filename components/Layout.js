import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function Layout({ children }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && router.pathname !== '/login') {
        router.push('/login')
      } else {
        setChecking(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && router.pathname !== '/login') {
        router.push('/login')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (router.pathname === '/login') {
    return children
  }

  if (checking) {
    return <p style={{ padding: 32 }}>Memuat...</p>
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20V11.5C4 7.36 7.36 4 11.5 4H12C16.14 4 19.5 7.36 19.5 11.5V20" stroke="#F2A900" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M2 20H21" stroke="#F2A900" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M4 15H19" stroke="#F2A900" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>
          </svg>
          <div className="brand-text">
            <h2>PM Dashboard</h2>
            <span>Project Monitoring</span>
          </div>
        </div>
        <nav>
          <Link href="/">Ringkasan</Link>
          <Link href="/quotations">Quotation</Link>
          <Link href="/finance">Keuangan</Link>
        </nav>
        <button onClick={handleLogout}>Keluar</button>
      </aside>
      <main className="content">
        <div className="page-transition" key={router.asPath}>
          {children}
        </div>
      </main>
    </div>
  )
}
