import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function Quotations() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ project_name: '', client_name: '' })

  async function loadData() {
    const { data } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })
    setList(data || [])
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
        <button type="submit">Submit Quotation</button>
      </form>

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
          {list.map((q) => (
            <tr key={q.id}>
              <td>{q.project_name}</td>
              <td>{q.client_name}</td>
              <td>{q.submit_date}</td>
              <td>
                <span className={`badge ${q.status}`}>{q.status}</span>
              </td>
              <td>
                <Link href={`/quotations/${q.id}`}>Detail</Link>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr>
              <td colSpan={5}>Belum ada quotation. Tambahkan lewat form di atas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
