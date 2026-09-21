import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'
import { IconQuotation, IconEmptyBox } from '../../components/Icons'

export default function Quotations() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ project_name: '', client_name: '' })

  async function loadData() {
    setLoading(true)
    const { data } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })
    setList(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const { data: userData } = await supabase.auth.getUser()
    await supabase.from('quotations').insert({
      project_name: form.project_name,
      client_name: form.client_name,
      created_by: userData?.user?.id,
    })
    setForm({ project_name: '', client_name: '' })
    loadData()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus quotation ini beserta seluruh PO, dokumen, dan data pembayaran terkait?')) return
    await supabase.from('quotations').delete().eq('id', id)
    loadData()
  }

  return (
    <div>
      <h1>Daftar Quotation</h1>

      <form onSubmit={handleSubmit} className="inline-form">
        <input
          placeholder="Nama Proyek"
          value={form.project_name}
          onChange={(e) => setForm({ ...form, project_name: e.target.value })}
          required
        />
        <input
          placeholder="Nama Client"
          value={form.client_name}
          onChange={(e) => setForm({ ...form, client_name: e.target.value })}
          required
        />
        <button type="submit">
          <IconQuotation style={{ width: 14, height: 14, marginRight: 6, verticalAlign: -2 }} />
          Submit Quotation
        </button>
      </form>

      {loading ? (
        <table>
          <tbody>
            {[1, 2, 3].map((n) => (
              <tr key={n}>
                <td><div className="skeleton skeleton-text" style={{ width: '80%' }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: '60%' }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: '40%' }}></div></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--steel)' }}>
          <IconEmptyBox style={{ width: 40, height: 40, marginBottom: 10, opacity: 0.5 }} />
          <p>Belum ada quotation. Tambahkan lewat form di atas.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Proyek</th>
              <th>Client</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((q, i) => (
              <tr key={q.id} style={{ animation: `fadeInUp 0.3s ease both`, animationDelay: `${i * 0.03}s` }}>
                <td>{q.project_name}</td>
                <td>{q.client_name}</td>
                <td>{q.submit_date}</td>
                <td>
                  <span className={`badge ${q.status}`}>{q.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <Link href={`/quotations/${q.id}`}>Detail</Link>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(q.id)}>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
