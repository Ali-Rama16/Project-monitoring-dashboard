import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function IconQuotation() {
  return (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 3h9l4 4v14H6z" strokeLinejoin="round" />
      <path d="M15 3v4h4" strokeLinejoin="round" />
      <path d="M9 12h7M9 15.5h7M9 8.5h3" strokeLinecap="round" />
    </svg>
  )
}

function IconPO() {
  return (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="5" y="4" width="14" height="17" rx="1" />
      <path d="M9 3h6v3H9z" />
      <path d="M8.5 12.5l2 2 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPaid() {
  return (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.2 2.2L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconUnpaid() {
  return (
    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  )
}

export default function Home() {
  const [stats, setStats] = useState({ quotations: 0, po: 0, paid: 0, unpaid: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const { count: quotationCount } = await supabase
        .from('quotations')
        .select('*', { count: 'exact', head: true })

      const { count: poCount } = await supabase
        .from('purchase_orders')
        .select('*', { count: 'exact', head: true })

      const { data: payments } = await supabase.from('payments').select('status, amount')

      const paid = (payments || [])
        .filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0)

      const unpaid = (payments || [])
        .filter((p) => p.status !== 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0)

      setStats({ quotations: quotationCount || 0, po: poCount || 0, paid, unpaid })
      setLoading(false)
    }
    loadStats()
  }, [])

  const total = stats.paid + stats.unpaid
  const paidPercent = total > 0 ? Math.round((stats.paid / total) * 100) : 0

  return (
    <div>
      <h1>Ringkasan Proyek</h1>

      {loading ? (
        <div className="cards">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="cards">
          <div className="card">
            <IconQuotation />
            <h3>{stats.quotations}</h3>
            <p>Total Quotation</p>
          </div>
          <div className="card">
            <IconPO />
            <h3>{stats.po}</h3>
            <p>Total PO</p>
          </div>
          <div className="card">
            <IconPaid />
            <h3>Rp {stats.paid.toLocaleString('id-ID')}</h3>
            <p>Sudah Dibayar</p>
          </div>
          <div className="card">
            <IconUnpaid />
            <h3>Rp {stats.unpaid.toLocaleString('id-ID')}</h3>
            <p>Belum Dibayar</p>
          </div>
        </div>
      )}

      {!loading && total > 0 && (
        <div style={{ marginTop: 28, maxWidth: 420 }}>
          <div className="meter">
            <div className="meter-fill" style={{ width: `${paidPercent}%` }}></div>
          </div>
          <p className="meter-label">
            {paidPercent}% dari total nilai pembayaran sudah lunas
          </p>
        </div>
      )}
    </div>
  )
}
