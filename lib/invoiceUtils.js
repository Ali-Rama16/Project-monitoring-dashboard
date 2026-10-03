// Menentukan tingkat urgensi tagihan berdasarkan tanggal jatuh tempo
export function getInvoiceUrgency(due_date, status) {
  if (status === 'paid') return 'paid'
  const diffDays = daysUntilDue(due_date)
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 3) return 'soon'
  return 'ok'
}

export function daysUntilDue(due_date) {
  const due = new Date(due_date + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((due - today) / 86400000)
}

// Teks yang ditampilkan ke pengguna, misalnya "Terlambat 2 hari" atau "3 hari lagi"
export function getDueDaysLabel(due_date, status) {
  if (status === 'paid') return 'Sudah lunas'
  const diffDays = daysUntilDue(due_date)
  if (diffDays < 0) return `Terlambat ${Math.abs(diffDays)} hari`
  if (diffDays === 0) return 'Jatuh tempo hari ini'
  return `${diffDays} hari lagi`
}

// badge class mengikuti palet warna yang sudah ada di globals.css
export function urgencyBadgeClass(urgency) {
  if (urgency === 'paid') return 'approved'
  if (urgency === 'overdue') return 'rejected'
  if (urgency === 'soon') return 'pending'
  return ''
}
