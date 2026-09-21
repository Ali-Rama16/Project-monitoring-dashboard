import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

function extractStoragePath(url) {
  const marker = '/documents/'
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.substring(idx + marker.length)
}

export default function QuotationDetail() {
  const router = useRouter()
  const { id } = router.query
  const [quotation, setQuotation] = useState(null)
  const [pos, setPos] = useState([])
  const [docs, setDocs] = useState([])
  const [poForm, setPoForm] = useState({ po_number: '' })
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ project_name: '', client_name: '' })

  async function loadAll() {
    if (!id) return
    const { data: q } = await supabase.from('quotations').select('*').eq('id', id).single()
    setQuotation(q)
    if (q) setEditForm({ project_name: q.project_name, client_name: q.client_name })

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

  async function saveEdit(e) {
    e.preventDefault()
    await supabase
      .from('quotations')
      .update({ project_name: editForm.project_name, client_name: editForm.client_name })
      .eq('id', id)
    setEditing(false)
    loadAll()
  }

  async function deleteQuotation() {
    if (!confirm('Hapus quotation ini beserta seluruh PO, dokumen, dan data pembayaran terkait? Tindakan ini tidak bisa dibatalkan.')) return
    await supabase.from('quotations').delete().eq('id', id)
    router.push('/quotations')
  }

  async function addPO(e) {
    e.preventDefault()
    await supabase.from('purchase_orders').insert({ quotation_id: id, po_number: poForm.po_number })
    setPoForm({ po_number: '' })
    loadAll()
  }

  async function updatePOStatus(poId, status) {
    await supabase.from('purchase_orders').update({ status }).eq('id', poId)
    loadAll()
  }

  async function deletePO(poId) {
    if (!confirm('Hapus PO ini beserta data pembayaran terkait?')) return
    await supabase.from('purchase_orders').delete().eq('id', poId)
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

  async function deleteDoc(doc) {
    if (!confirm('Hapus dokumen ini?')) return
    const path = extractStoragePath(doc.file_url)
    if (path) {
      await supabase.storage.from('documents').remove([path])
    }
    await supabase.from('documents').delete().eq('id', doc.id)
    loadAll()
  }

  if (!quotation) return <p>Memuat...</p>

  return (
    <div>
      <div className="page-header">
        {editing ? (
          <form onSubmit={saveEdit} className="inline-form">
            <input
              value={editForm.project_name}
              onChange={(e) => setEditForm({ ...editForm, project_name: e.target.value })}
              required
            />
            <input
              value={editForm.client_name}
              onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
              required
            />
            <button type="submit">Simpan</button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
              Batal
            </button>
          </form>
        ) : (
          <div>
            <h1>{quotation.project_name}</h1>
            <p>Client: {quotation.client_name}</p>
          </div>
        )}
        {!editing && (
          <div className="row-actions">
            <button className="btn-sm btn-secondary" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="btn-sm btn-danger" onClick={deleteQuotation}>
              Hapus Quotation
            </button>
          </div>
        )}
      </div>

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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pos.map((po) => (
            <tr key={po.id}>
              <td>{po.po_number}</td>
              <td>
                <select value={po.status} onChange={(e) => updatePOStatus(po.id, e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="received">Diterima</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </td>
              <td>{po.po_date}</td>
              <td>
                <button className="btn-sm btn-danger" onClick={() => deletePO(po.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {pos.length === 0 && (
            <tr>
              <td colSpan={4}>Belum ada PO.</td>
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
            <th></th>
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
              <td>
                <button className="btn-sm btn-danger" onClick={() => deleteDoc(d)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {docs.length === 0 && (
            <tr>
              <td colSpan={3}>Belum ada dokumen.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
