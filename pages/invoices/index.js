import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { getInvoiceUrgency, getDueDaysLabel, urgencyBadgeClass } from '../../lib/invoiceUtils'
import { IconUpload } from '../../components/Icons'

function extractStoragePath(url) {
  const marker = '/documents/'
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.substring(idx + marker.length)
}

const emptyForm = {
  supplier_name: '',
  invoice_number: '',
  category: 'material',
  amount: '',
  due_date: '',
  due_time: '',
  keterangan: '',
}

export default function Invoices() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState(emptyForm)

  async function loadData() {
    setLoading(true)
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .order('due_date', { ascending: true })
    setList(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('invoices').insert({
      supplier_name: form.supplier_name,
      invoice_number: form.invoice_number,
      category: form.category,
      amount: form.amount,
      due_date: form.due_date,
      due_time: form.due_time || null,
      keterangan: form.keterangan,
    })
    setForm(emptyForm)
    loadData()
  }

  function startEdit(inv) {
    setEditingId(inv.id)
    setEditData({
      supplier_name: inv.supplier_name,
      invoice_number: inv.invoice_number || '',
      category: inv.category || 'material',
      amount: inv.amount,
      due_date: inv.due_date,
      due_time: inv.due_time || '',
      keterangan: inv.keterangan || '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id) {
    await supabase
      .from('invoices')
      .update({
        supplier_name: editData.supplier_name,
        invoice_number: editData.invoice_number,
        category: editData.category,
        amount: editData.amount,
        due_date: editData.due_date,
        due_time: editData.due_time || null,
        keterangan: editData.keterangan,
      })
      .eq('id', id)
    setEditingId(null)
    loadData()
  }

  async function togglePaid(inv) {
    await supabase
      .from('invoices')
      .update({ status: inv.status === 'paid' ? 'unpaid' : 'paid' })
      .eq('id', inv.id)
    loadData()
  }

  async function deleteInvoice(id) {
    if (!confirm('Hapus tagihan ini?')) return
    await supabase.from('invoices').delete().eq('id', id)
    loadData()
  }

  async function uploadInvoiceFile(inv, e) {
    const input = e.target
    const file = input.files[0]
    if (!file) return
    const filePath = `invoices/${inv.id}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('documents').upload(filePath, file)
    if (!error) {
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath)
      await supabase
        .from('invoices')
        .update({ file_name: file.name, file_url: urlData.publicUrl })
        .eq('id', inv.id)
      loadData()
    } else {
      alert('Gagal upload: ' + error.message)
    }
    input.value = ''
  }

  async function removeInvoiceFile(inv) {
    if (!confirm('Hapus bukti tagihan ini?')) return
    const path = inv.file_url ? extractStoragePath(inv.file_url) : null
    if (path) {
      await supabase.storage.from('documents').remove([path])
    }
    await supabase.from('invoices').update({ file_name: null, file_url: null }).eq('id', inv.id)
    loadData()
  }

  return (
    <div>
      <h1>Tagihan Supplier</h1>
      <p style={{ marginTop: -12, marginBottom: 20, color: 'var(--steel)' }}>
        Invoice dari supplier material/jasa yang perlu kita bayar, diurutkan dari jatuh tempo paling dekat.
      </p>

      <form onSubmit={handleSubmit} className="inline-form">
        <input
          placeholder="Nama Supplier"
          value={form.supplier_name}
          onChange={(e) => setForm({ ...form, supplier_name: e.target.value })}
          required
        />
        <input
          placeholder="No. Invoice (opsional)"
          value={form.invoice_number}
          onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
        />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="material">Material</option>
          <option value="jasa">Jasa</option>
        </select>
        <input
          type="number"
          placeholder="Nilai Tagihan"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          required
          title="Tanggal jatuh tempo"
        />
        <input
          type="time"
          value={form.due_time}
          onChange={(e) => setForm({ ...form, due_time: e.target.value })}
          title="Jam jatuh tempo (opsional, default akhir hari)"
        />
        <input
          placeholder="Keterangan (opsional)"
          value={form.keterangan}
          onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
        />
        <button type="submit">Tambah Tagihan</button>
      </form>

      {loading ? (
        <table>
          <tbody>
            {[1, 2, 3].map((n) => (
              <tr key={n}>
                <td><div className="skeleton skeleton-text" style={{ width: '70%' }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: '60%' }}></div></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>No. Invoice</th>
              <th>Kategori</th>
              <th>Nilai</th>
              <th>Jatuh Tempo</th>
              <th>Keterangan</th>
              <th>Status</th>
              <th>Bukti Tagihan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((inv) => {
              const urgency = getInvoiceUrgency(inv.due_date, inv.due_time, inv.status)
              const label = getDueDaysLabel(inv.due_date, inv.due_time, inv.status)

              if (editingId === inv.id) {
                return (
                  <tr key={inv.id}>
                    <td>
                      <input
                        value={editData.supplier_name}
                        onChange={(e) => setEditData({ ...editData, supplier_name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={editData.invoice_number}
                        onChange={(e) => setEditData({ ...editData, invoice_number: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      >
                        <option value="material">Material</option>
                        <option value="jasa">Jasa</option>
                      </select>
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
                        type="date"
                        value={editData.due_date}
                        onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
                      />
                      <input
                        type="time"
                        value={editData.due_time}
                        onChange={(e) => setEditData({ ...editData, due_time: e.target.value })}
                        style={{ marginTop: 4 }}
                      />
                    </td>
                    <td>
                      <input
                        value={editData.keterangan}
                        onChange={(e) => setEditData({ ...editData, keterangan: e.target.value })}
                      />
                    </td>
                    <td>
                      <span className={`badge ${urgencyBadgeClass(urgency)}`}>{inv.status}</span>
                    </td>
                    <td>
                      {inv.file_url ? (
                        <a href={inv.file_url} target="_blank" rel="noreferrer">
                          {inv.file_name || 'Lihat file'}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn-sm" onClick={() => saveEdit(inv.id)}>
                          Simpan
                        </button>
                        <button className="btn-sm btn-secondary" onClick={cancelEdit}>
                          Batal
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={inv.id}>
                  <td>{inv.supplier_name}</td>
                  <td>{inv.invoice_number || '-'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{inv.category}</td>
                  <td>Rp {Number(inv.amount).toLocaleString('id-ID')}</td>
                  <td>
                    <div>
                      {inv.due_date}
                      {inv.due_time ? ` ${inv.due_time.slice(0, 5)}` : ''}
                    </div>
                    <span className={`badge ${urgencyBadgeClass(urgency)}`}>{label}</span>
                  </td>
                  <td>{inv.keterangan || '-'}</td>
                  <td>
                    <span className={`badge ${inv.status === 'paid' ? 'approved' : ''}`}>
                      {inv.status === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                    </span>
                  </td>
                  <td>
                    {inv.file_url ? (
                      <div className="row-actions">
                        <a href={inv.file_url} target="_blank" rel="noreferrer">
                          {inv.file_name || 'Lihat file'}
                        </a>
                        <label className="upload-label btn-sm" style={{ padding: '4px 10px' }}>
                          Ganti
                          <input
                            type="file"
                            onChange={(e) => uploadInvoiceFile(inv, e)}
                            style={{ display: 'none' }}
                          />
                        </label>
                        <button className="btn-sm btn-danger" onClick={() => removeInvoiceFile(inv)}>
                          Hapus File
                        </button>
                      </div>
                    ) : (
                      <label className="upload-label btn-sm" style={{ padding: '4px 10px' }}>
                        <IconUpload style={{ width: 13, height: 13, marginRight: 5, verticalAlign: -2 }} />
                        Upload
                        <input
                          type="file"
                          onChange={(e) => uploadInvoiceFile(inv, e)}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-sm btn-secondary" onClick={() => togglePaid(inv)}>
                        {inv.status === 'paid' ? 'Batal Lunas' : 'Tandai Lunas'}
                      </button>
                      <button className="btn-sm btn-secondary" onClick={() => startEdit(inv)}>
                        Edit
                      </button>
                      <button className="btn-sm btn-danger" onClick={() => deleteInvoice(inv.id)}>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={9}>Belum ada tagihan.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
