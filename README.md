# Project Monitoring Dashboard

Panduan ini ditulis untuk pemula. Ikuti urutannya dari atas ke bawah, jangan lompat.

## Yang sudah dibuatkan
- Halaman Login
- Ringkasan (dashboard utama: total quotation, PO, dan status keuangan)
- Daftar & Submit Quotation
- Detail Quotation: ubah status, tambah PO, upload dokumen pendukung
- Halaman Status Keuangan (catat pembayaran per PO)

## Langkah 1 — Install Node.js
1. Buka https://nodejs.org, download versi **LTS**, install seperti biasa.
2. Cek berhasil dengan membuka Terminal (Mac) / Command Prompt (Windows), lalu ketik:
   ```
   node -v
   ```
   Jika muncul nomor versi (misal `v20.x.x`), berarti berhasil.

## Langkah 2 — Buat akun Supabase
1. Buka https://supabase.com, daftar gratis (bisa pakai akun GitHub/Google).
2. Klik **New Project**, isi nama project (misal `pm-dashboard`), buat password database (simpan baik-baik), pilih region terdekat (Singapore).
3. Tunggu 1-2 menit sampai project selesai dibuat.

## Langkah 3 — Buat tabel database
1. Di dashboard Supabase, buka menu **SQL Editor** di sidebar kiri.
2. Klik **New query**.
3. Buka file `supabase/schema.sql` yang ada di folder project ini, copy semua isinya, paste ke SQL Editor.
4. Klik **Run**. Jika berhasil, akan muncul tabel `quotations`, `purchase_orders`, `documents`, `payments` di menu **Table Editor**.

## Langkah 4 — Buat tempat penyimpanan file (Storage)
1. Di sidebar Supabase, buka menu **Storage**.
2. Klik **New bucket**, beri nama `documents`.
3. Aktifkan toggle **Public bucket** (supaya link dokumen bisa dibuka langsung).

## Langkah 5 — Ambil kunci API Supabase
1. Di sidebar Supabase, buka menu **Project Settings** (ikon gerigi) → **API**.
2. Catat dua nilai ini:
   - **Project URL**
   - **anon public key**

## Langkah 6 — Siapkan project di komputer
1. Buka Terminal, masuk ke folder project ini:
   ```
   cd project-monitoring-dashboard
   ```
2. Install semua library yang dibutuhkan:
   ```
   npm install
   ```
3. Duplikat file `.env.local.example` menjadi `.env.local`:
   ```
   cp .env.local.example .env.local
   ```
   (Di Windows pakai File Explorer: copy-paste file lalu rename.)
4. Buka file `.env.local`, isi dengan Project URL dan anon key dari Langkah 5.

## Langkah 7 — Jalankan di komputer sendiri
```
npm run dev
```
Buka browser ke **http://localhost:3000** — akan diarahkan ke halaman Login.

## Langkah 8 — Buat akun login pertama
Karena ini aplikasi internal, akun dibuat manual oleh admin (bukan pendaftaran bebas):
1. Di Supabase, buka menu **Authentication** → **Users**.
2. Klik **Add user** → **Create new user**.
3. Isi email dan password untuk tim Anda. Ulangi untuk tiap anggota tim.
4. Gunakan email & password itu untuk login di aplikasi.

## Langkah 9 — Coba semua fitur
1. Login.
2. Di halaman Quotation, submit satu quotation contoh.
3. Klik **Detail** pada quotation itu → ubah status, tambah nomor PO, upload satu file dokumen.
4. Buka halaman Keuangan, catat satu pembayaran untuk PO yang baru dibuat.
5. Kembali ke halaman Ringkasan, pastikan angkanya sudah berubah.

## Langkah 10 — Deploy supaya bisa diakses tim (bukan cuma di komputer sendiri)
1. Buat akun gratis di https://github.com, buat repository baru, upload folder project ini ke sana (lewat GitHub Desktop kalau belum terbiasa dengan perintah git).
2. Buat akun gratis di https://vercel.com, login pakai akun GitHub.
3. Klik **Add New Project**, pilih repository yang tadi diupload.
4. Sebelum klik Deploy, buka bagian **Environment Variables**, tambahkan dua variabel yang sama seperti di `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Klik **Deploy**. Setelah selesai, Vercel akan memberi link (misal `pm-dashboard.vercel.app`) yang bisa dibagikan ke tim internal.

## Kalau ingin menambah fitur lain nanti
Struktur project ini sengaja dibuat sederhana per halaman (`pages/`), jadi menambah menu baru = menambah 1 file baru di folder `pages/` mengikuti pola yang sudah ada (lihat `pages/finance.js` sebagai contoh paling sederhana).
