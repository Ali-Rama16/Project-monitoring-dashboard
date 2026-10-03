import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { TruckIcon } from './Icons'
import { GearIcon, BlueprintSketch } from './Illustrations'
import TeamPhoto from './TeamPhoto'
import { getInvoiceUrgency, getDueDaysLabel } from '../lib/invoiceUtils'

const NAV = [
  { href: '/', label: 'Ringkasan' },
  { href: '/quotations', label: 'Quotation' },
  { href: '/finance', label: 'Keuangan' },
  { href: '/invoices', label: 'Tagihan Supplier' },
]

const CHECK_INTERVAL_MS = 5 * 60 * 1000 // cek ulang tiap 5 menit selama tab terbuka

function notifyUrgentInvoices(urgentList) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission === 'default') {
    Notification.requestPermission()
    return
  }
  if (Notification.permission !== 'granted') return

  const todayKey = new Date().toISOString().slice(0, 10)
  const storeKey = `invoice_notified_${todayKey}`
  let notified = []
  try {
    notified = JSON.parse(localStorage.getItem(storeKey) || '[]')
  } catch {
    notified = []
  }

  const toNotify = urgentList.filter((inv) => !notified.includes(inv.id))
  toNotify.forEach((inv) => {
    const title =
      inv.urgency === 'overdue'
        ? `Tagihan Terlambat: ${inv.supplier_name}`
        : `Jatuh Tempo Segera: ${inv.supplier_name}`
    new Notification(title, {
      body: `${inv.invoice_number ? inv.invoice_number + ' — ' : ''}Rp ${Number(inv.amount).toLocaleString('id-ID')} — ${inv.label}`,
      tag: inv.id,
    })
  })

  if (toNotify.length > 0) {
    localStorage.setItem(storeKey, JSON.stringify([...notified, ...toNotify.map((i) => i.id)]))
  }
}

export default function Layout({ children }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [urgentCount, setUrgentCount] = useState(0)

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

  // Cek tagihan yang mendekati/lewat jatuh tempo, lalu update badge + kirim notifikasi browser
  useEffect(() => {
    if (checking || router.pathname === '/login') return

    async function checkInvoices() {
      const { data } = await supabase
        .from('invoices')
        .select('id, supplier_name, invoice_number, amount, due_date, status')
        .neq('status', 'paid')

      const urgent = (data || [])
        .map((inv) => ({
          ...inv,
          urgency: getInvoiceUrgency(inv.due_date, inv.status),
          label: getDueDaysLabel(inv.due_date, inv.status),
        }))
        .filter((inv) => inv.urgency === 'overdue' || inv.urgency === 'soon')

      setUrgentCount(urgent.length)
      notifyUrgentInvoices(urgent)
    }

    checkInvoices()
    const timer = setInterval(checkInvoices, CHECK_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [checking, router.pathname])

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
              <span className="nav-label">
                {item.label}
                {item.href === '/invoices' && urgentCount > 0 && (
                  <span className="nav-badge">{urgentCount}</span>
                )}
              </span>
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
