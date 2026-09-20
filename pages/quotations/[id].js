import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function QuotationDetail() {
  const router = useRouter()
  const { id } = router.query
  const [quotation, setQuotation] = useState(null)
  const [pos, setPos] = useState([])
  const [docs, setDocs] = useState([])
  const [poForm, setPoForm] = useState({ po_number: '' })

  async function loadAll() {
    if (!id) return
    const { data: q } = await supabase.from('quotations').select('*').eq('id', id).single()
    setQuotation(q)

    const { data: poList } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('quotation_id', id)
    setPos(poList || [])

    const { data: docList } = await supabase
      .from('documents')
      .select('*')
      .eq('quotation_id', id)
    setDocs(docList || [])
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function updateStatus(status) {
    await supabase.from('quotations').update({ status }).eq('id', id)
    loadAll()
  }

  async function addPO(e) {
    e.preventDefault()
    await supabase.from('purchase_orders').insert({ quotation_id: id, po_number: poForm.po_number })
    setPoForm({ po_number: '' })
    loadAll()
  }

  async function uploadDoc(e) {
    const file = e.target.files[0]
    if (!file) return
    const filePath = `${id}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('documents').upload(filePath, file)
    if (!error) {
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath)
      await supabase.from('documents').insert({
        quotation_id: id,
        file_name: file.name,
        file_url: urlData.publicUrl,
      })
      loadAll()
    } else {
      alert('Gagal upload: ' + error.message)
    }
  }

  if (!quotation) return <p>Memuat...</p>

  return (
    <div>
      <h1>{quotation.project_name}</h1>
      <p>Client: {quotation.client_name}</p>

      <div className="status-actions">
        <span>
          Status saat ini: <b>{quotation.status}</b>
        </span>
        <select value={quotation.status} onChange={(e) => updateStatus(e.target.value)}>
          <option value="draft">Draft</option>
          <option value="submitted">Terkirim</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      <h2>Purchase Order</h2>
      <form onSubmit={addPO} className="inline-form">
        <input
          placeholder="Nomor PO"
          value={poForm.po_number}
          onChange={(e) => setPoForm({ po_number: e.target.value })}
          required
        />
        <button type="submit">Tambah PO</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nomor PO</th>
            <th>Status</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {pos.map((po) => (
            <tr key={po.id}>
              <td>{po.po_number}</td>
              <td>
                <span className={`badge ${po.status}`}>{po.status}</span>
              </td>
              <td>{po.po_date}</td>
            </tr>
          ))}
          {pos.length === 0 && (
            <tr>
              <td colSpan={3}>Belum ada PO.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Dokumen Pendukung</h2>
      <input type="file" onChange={uploadDoc} />
      <table>
        <thead>
          <tr>
            <th>Nama File</th>
            <th>Diunggah</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((d) => (
            <tr key={d.id}>
              <td>
                <a href={d.file_url} target="_blank" rel="noreferrer">
                  {d.file_name}
                </a>
              </td>
              <td>{new Date(d.uploaded_at).toLocaleDateString('id-ID')}</td>
            </tr>
          ))}
          {docs.length === 0 && (
            <tr>
              <td colSpan={2}>Belum ada dokumen.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
