import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { TruckIcon } from './Icons'
import { GearIcon, BlueprintSketch } from './Illustrations'
import TeamPhoto from './TeamPhoto'

const NAV = [
  { href: '/', label: 'Ringkasan' },
  { href: '/quotations', label: 'Quotation' },
  { href: '/finance', label: 'Keuangan' },
]

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

  const isActive = (href) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href)

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <img src="/logo.png" alt="Always Selalu" />
          </div>
          <div className="brand-text">
            <span>Project Monitoring</span>
          </div>
        </div>
        <nav>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(item.href) ? 'active' : ''}>
              <span>{item.label}</span>
              <GearIcon className={`nav-gear${isActive(item.href) ? ' spin' : ''}`} />
            </Link>
          ))}
        </nav>
        <BlueprintSketch className="sidebar-sketch" />
        <button onClick={handleLogout}>Keluar</button>
      </aside>
      <main className="content">
        <div className="page-transition" key={router.asPath}>
          {children}
        </div>
      </main>
      <TeamPhoto />
      <div className="activity-strip">
        <TruckIcon className="truck" />
        <span className="strip-copy">© 2026 Always Selalu</span>
      </div>
    </div>
  )
}
