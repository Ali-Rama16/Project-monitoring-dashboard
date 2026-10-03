// Menggabungkan tanggal + jam jatuh tempo jadi satu waktu pasti.
// Kalau jam belum diisi (data lama), dianggap jatuh tempo di akhir hari (23:59)
// supaya tagihan lama tidak tiba-tiba jadi "terlambat" begitu fitur ini aktif.
function getDueDateTime(due_date, due_time) {
  return new Date(`${due_date}T${due_time || '23:59:59'}`)
}

function msUntilDue(due_date, due_time) {
  return getDueDateTime(due_date, due_time) - new Date()
}

// Tingkat urgensi: overdue (lewat), urgent (<24 jam lagi), soon (<=3 hari), ok (masih aman)
export function getInvoiceUrgency(due_date, due_time, status) {
  if (status === 'paid') return 'paid'
  const diffMs = msUntilDue(due_date, due_time)
  if (diffMs < 0) return 'overdue'
  if (diffMs <= 24 * 60 * 60 * 1000) return 'urgent'
  if (diffMs <= 3 * 24 * 60 * 60 * 1000) return 'soon'
  return 'ok'
}

// Teks yang ditampilkan ke pengguna — pakai jam/menit kalau waktunya kurang dari sehari
export function getDueDaysLabel(due_date, due_time, status) {
  if (status === 'paid') return 'Sudah lunas'

  const diffMs = msUntilDue(due_date, due_time)
  const absMs = Math.abs(diffMs)
  const days = Math.floor(absMs / 86400000)
  const hours = Math.floor((absMs % 86400000) / 3600000)
  const minutes = Math.floor((absMs % 3600000) / 60000)

  let text
  if (days > 0) {
    text = hours > 0 ? `${days} hari ${hours} jam` : `${days} hari`
  } else if (hours > 0) {
    text = `${hours} jam ${minutes} menit`
  } else {
    text = `${minutes} menit`
  }

  if (diffMs < 0) return `Terlambat ${text}`
  return `${text} lagi`
}

// badge class mengikuti palet warna yang sudah ada di globals.css
export function urgencyBadgeClass(urgency) {
  if (urgency === 'paid') return 'approved'
  if (urgency === 'overdue' || urgency === 'urgent') return 'rejected'
  if (urgency === 'soon') return 'pending'
  return ''
}
