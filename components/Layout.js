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
        <h2>PM Dashboard</h2>
        <nav>
          <Link href="/">Ringkasan</Link>
          <Link href="/quotations">Quotation</Link>
          <Link href="/finance">Keuangan</Link>
        </nav>
        <button onClick={handleLogout}>Keluar</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}
