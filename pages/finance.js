import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Finance() {
  const [payments, setPayments] = useState([])
  const [pos, setPos] = useState([])
  const [form, setForm] = useState({ po_id: '', amount: '', status: 'unpaid' })
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({ amount: '', status: 'unpaid' })

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

  function startEdit(p) {
    setEditingId(p.id)
    setEditValues({ amount: p.amount, status: p.status })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id) {
    await supabase
      .from('payments')
      .update({ amount: editValues.amount, status: editValues.status })
      .eq('id', id)
    setEditingId(null)
    loadData()
  }

  async function deletePayment(id) {
    if (!confirm('Hapus data pembayaran ini?')) return
    await supabase.from('payments').delete().eq('id', id)
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.purchase_orders?.po_number}</td>
              {editingId === p.id ? (
                <>
                  <td>
                    <input
                      type="number"
                      value={editValues.amount}
                      onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      value={editValues.status}
                      onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                    >
                      <option value="unpaid">Belum Dibayar</option>
                      <option value="partial">Sebagian</option>
                      <option value="paid">Lunas</option>
                    </select>
                  </td>
                  <td>{p.payment_date}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-sm" onClick={() => saveEdit(p.id)}>
                        Simpan
                      </button>
                      <button className="btn-sm btn-secondary" onClick={cancelEdit}>
                        Batal
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td>Rp {Number(p.amount).toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`badge ${p.status}`}>{p.status}</span>
                  </td>
                  <td>{p.payment_date}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-sm btn-secondary" onClick={() => startEdit(p)}>
                        Edit
                      </button>
                      <button className="btn-sm btn-danger" onClick={() => deletePayment(p.id)}>
                        Hapus
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={5}>Belum ada data pembayaran.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
