import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function toNumber(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export default function Finance() {
  const [payments, setPayments] = useState([])
  const [pos, setPos] = useState([])
  const [form, setForm] = useState({
    po_id: '',
    amount: '',
    amount_paid: '',
    status: 'unpaid',
    keterangan: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ amount: '', amount_paid: '', status: 'unpaid', keterangan: '' })

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
      amount_paid: form.amount_paid || 0,
      status: form.status,
      keterangan: form.keterangan,
    })
    setForm({ po_id: '', amount: '', amount_paid: '', status: 'unpaid', keterangan: '' })
    loadData()
  }

  function startEdit(p) {
    setEditingId(p.id)
    setEditData({
      amount: p.amount,
      amount_paid: p.amount_paid || 0,
      status: p.status,
      keterangan: p.keterangan || '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id) {
    await supabase
      .from('payments')
      .update({
        amount: editData.amount,
        amount_paid: editData.amount_paid || 0,
        status: editData.status,
        keterangan: editData.keterangan,
      })
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
          <option value="">Pilih Nomor Referensi</option>
          {pos.map((po) => (
            <option key={po.id} value={po.id}>
              {po.po_number}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Nilai Kontrak"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Sudah Dibayar (opsional)"
          value={form.amount_paid}
          onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
        />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="unpaid">Belum Dibayar</option>
          <option value="partial">Sebagian</option>
          <option value="paid">Lunas</option>
        </select>
        <input
          placeholder="Keterangan (opsional)"
          value={form.keterangan}
          onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
        />
        <button type="submit">Simpan</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nama Pekerjaan</th>
            <th>Nilai Kontrak</th>
            <th>Sudah Dibayar</th>
            <th>Sisa</th>
            <th>Status</th>
            <th>Nomor Referensi</th>
            <th>Tanggal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => {
            const contract = toNumber(p.amount)
            const paid = toNumber(p.amount_paid)
            const remaining = Math.max(contract - paid, 0)

            return (
              <tr key={p.id}>
                {editingId === p.id ? (
                  <>
                    <td>
                      <input
                        value={editData.keterangan}
                        onChange={(e) => setEditData({ ...editData, keterangan: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editData.amount_paid}
                        onChange={(e) => setEditData({ ...editData, amount_paid: e.target.value })}
                      />
                    </td>
                    <td>Rp {Math.max(toNumber(editData.amount) - toNumber(editData.amount_paid), 0).toLocaleString('id-ID')}</td>
                    <td>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      >
                        <option value="unpaid">Belum Dibayar</option>
                        <option value="partial">Sebagian</option>
                        <option value="paid">Lunas</option>
                      </select>
                    </td>
                    <td>{p.purchase_orders?.po_number}</td>
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
                    <td>{p.keterangan || '-'}</td>
                    <td>Rp {contract.toLocaleString('id-ID')}</td>
                    <td>Rp {paid.toLocaleString('id-ID')}</td>
                    <td>Rp {remaining.toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`badge ${p.status}`}>{p.status}</span>
                    </td>
                    <td>{p.purchase_orders?.po_number}</td>
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
            )
          })}
          {payments.length === 0 && (
            <tr>
              <td colSpan={8}>Belum ada data pembayaran.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
