// Kirim pesan WhatsApp lewat Fonnte (https://fonnte.com).
// Perlu env var FONNTE_TOKEN (dari dashboard Fonnte) dan WA_NOTIFY_NUMBERS
// (nomor tujuan, format 628xxxxxxxxxx, pisahkan dengan koma kalau lebih dari satu).
export async function sendWhatsapp(message) {
  const token = process.env.FONNTE_TOKEN
  const numbers = (process.env.WA_NOTIFY_NUMBERS || '')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)

  if (!token || numbers.length === 0) {
    console.warn('FONNTE_TOKEN atau WA_NOTIFY_NUMBERS belum diatur — lewati pengiriman WA')
    return { skipped: true }
  }

  const results = []
  for (const target of numbers) {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ target, message }),
    })
    const json = await res.json().catch(() => ({}))
    results.push({ target, status: res.status, ...json })
  }
  return results
}
