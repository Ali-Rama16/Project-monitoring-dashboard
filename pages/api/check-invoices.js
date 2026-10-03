import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { getInvoiceUrgency, getDueDaysLabel } from '../../lib/invoiceUtils'
import { sendWhatsapp } from '../../lib/sendWhatsapp'

// Endpoint ini dipanggil otomatis tiap hari oleh Vercel Cron Job (lihat vercel.json).
// Vercel otomatis mengirim header "Authorization: Bearer <CRON_SECRET>" saat memanggil
// cron milik project ini, jadi endpoint ini aman dari pemanggilan sembarang orang
// selama CRON_SECRET sudah diisi di Environment Variables Vercel.
export default async function handler(req, res) {
  const authHeader = req.headers.authorization || ''
  const expected = `Bearer ${process.env.CRON_SECRET}`

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { data, error } = await supabaseAdmin
    .from('invoices')
    .select('id, supplier_name, invoice_number, amount, due_date, due_time, status')
    .neq('status', 'paid')

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const urgent = (data || [])
    .map((inv) => ({
      ...inv,
      urgency: getInvoiceUrgency(inv.due_date, inv.due_time, inv.status),
      label: getDueDaysLabel(inv.due_date, inv.due_time, inv.status),
    }))
    .filter((inv) => inv.urgency !== 'ok')
    .sort(
      (a, b) =>
        new Date(`${a.due_date}T${a.due_time || '23:59:59'}`) -
        new Date(`${b.due_date}T${b.due_time || '23:59:59'}`)
    )

  if (urgent.length === 0) {
    return res.status(200).json({ sent: false, reason: 'Tidak ada tagihan mendesak hari ini' })
  }

  const lines = urgent.map((inv) => {
    const tag = inv.urgency === 'overdue' ? '🔴 TERLAMBAT' : inv.urgency === 'urgent' ? '🟠 SEGERA' : '🟡'
    const no = inv.invoice_number ? ` (${inv.invoice_number})` : ''
    return `${tag} ${inv.supplier_name}${no} — Rp ${Number(inv.amount).toLocaleString('id-ID')} — ${inv.label}`
  })

  const message = `*Pengingat Tagihan Supplier*\n\n${lines.join('\n')}\n\nCek detail lengkap di dashboard Project Monitoring.`

  const waResult = await sendWhatsapp(message)

  res.status(200).json({ sent: true, count: urgent.length, waResult })
}
