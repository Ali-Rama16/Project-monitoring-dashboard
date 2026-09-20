import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [stats, setStats] = useState({ quotations: 0, po: 0, paid: 0, unpaid: 0 })

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
    }
    loadStats()
  }, [])

  return (
    <div>
      <h1>Ringkasan Proyek</h1>
      <div className="cards">
        <div className="card">
          <h3>{stats.quotations}</h3>
          <p>Total Quotation</p>
        </div>
        <div className="card">
          <h3>{stats.po}</h3>
          <p>Total PO</p>
        </div>
        <div className="card">
          <h3>Rp {stats.paid.toLocaleString('id-ID')}</h3>
          <p>Sudah Dibayar</p>
        </div>
        <div className="card">
          <h3>Rp {stats.unpaid.toLocaleString('id-ID')}</h3>
          <p>Belum Dibayar</p>
        </div>
      </div>
    </div>
  )
}
