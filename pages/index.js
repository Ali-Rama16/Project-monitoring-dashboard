import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { IconQuotation, IconPO, IconPaid, IconUnpaid } from '../components/Icons'
import {
  DecoCrane,
  DecoCompass,
  DecoBlueprintCheck,
  DecoCoins,
  DecoTruck,
  ConstructionScene,
} from '../components/Illustrations'

function CardSkeleton() {
  return (
    <div className="card">
      <div className="plate">
        <div className="plate-body">
          <div className="skeleton" style={{ width: 46, height: 46, borderRadius: 13 }}></div>
          <div className="skeleton skeleton-title" style={{ marginTop: 14 }}></div>
          <div className="skeleton skeleton-text"></div>
        </div>
      </div>
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
          <Link href="/quotations" className="card">
            <div className="plate">
              <DecoCompass className="deco deco-compass" />
              <div className="plate-body">
                <div className="badge-icon">
                  <IconQuotation />
                </div>
                <h3>{stats.quotations}</h3>
                <p>Total Quotation</p>
              </div>
            </div>
            <DecoCrane className="crane" />
          </Link>

          <Link href="/quotations" className="card">
            <div className="plate">
              <DecoBlueprintCheck className="deco deco-blueprint" />
              <div className="plate-body">
                <div className="badge-icon">
                  <IconPO />
                </div>
                <h3>{stats.po}</h3>
                <p>Total Nomor Referensi</p>
              </div>
            </div>
            <DecoCrane className="crane" />
          </Link>

          <Link href="/finance" className="card">
            <div className="plate">
              <DecoCoins className="deco deco-coins" />
              <div className="plate-body">
                <div className="badge-icon round">
                  <IconPaid />
                </div>
                <h3>Rp {stats.paid.toLocaleString('id-ID')}</h3>
                <p>Sudah Dibayar</p>
              </div>
            </div>
          </Link>

          <Link href="/finance" className="card">
            <div className="plate">
              <DecoTruck className="deco deco-truck" />
              <div className="plate-body">
                <div className="badge-icon round">
                  <IconUnpaid />
                </div>
                <h3>Rp {stats.unpaid.toLocaleString('id-ID')}</h3>
                <p>Belum Dibayar</p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {!loading && total > 0 && (
        <div style={{ marginTop: 28, maxWidth: 560 }}>
          <div className="meter">
            <div className="meter-fill" style={{ width: `${paidPercent}%` }}></div>
          </div>
          <p className="meter-label">
            {paidPercent}% dari total nilai pembayaran sudah lunas
          </p>
        </div>
      )}

      <div className="scene">
        <ConstructionScene />
      </div>
    </div>
  )
}
