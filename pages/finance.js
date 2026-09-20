import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Finance() {
  const [payments, setPayments] = useState([])
  const [pos, setPos] = useState([])
  const [form, setForm] = useState({ po_id: '', amount: '', status: 'unpaid' })

  async function loadData() {
    const { data: poList } = await supabase.from('purchase_orders').select('id, po_number')
    setPos(poList || [])

    const { data: payList } = await supabase
      .from('payments')
      .select('*, purchase_orders(po_number)')
      .order('created_at', { ascending: false })
    setPayments(payList || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('payments').insert({
      po_id: form.po_id,
      amount: form.amount,
      status: form.status,
    })
    setForm({ po_id: '', amount: '', status: 'unpaid' })
    loadData()
  }

  return (
    <div>
      <h1>Status Keuangan</h1>

      <form onSubmit={handleSubmit} className="inline-form">
        <select
          value={form.po_id}
          onChange={(e) => setForm({ ...form, po_id: e.target.value })}
          required
        >
          <option value="">Pilih PO</option>
          {pos.map((po) => (
            <option key={po.id} value={po.id}>
              {po.po_number}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Jumlah"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="unpaid">Belum Dibayar</option>
          <option value="partial">Sebagian</option>
          <option value="paid">Lunas</option>
        </select>
        <button type="submit">Simpan</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>PO</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.purchase_orders?.po_number}</td>
              <td>Rp {Number(p.amount).toLocaleString('id-ID')}</td>
              <td>
                <span className={`badge ${p.status}`}>{p.status}</span>
              </td>
              <td>{p.payment_date}</td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={4}>Belum ada data pembayaran.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
