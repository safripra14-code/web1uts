# Toko Buku Online — UTS Pemrograman Web

Aplikasi web **front-end** sederhana untuk pemesanan buku pada toko online. Seluruh data tidak diambil dari server/database, melainkan dari variabel/konstanta JavaScript dalam format **Array JSON** pada `js/data.js`.

**Identitas:** Syafri Prayogo — 312510500 — TI.25.C.13

## Akun Demo (Login) — dari `data.js` (`dataPengguna`)

| Email | Password | Role |
|---|---|---|
| `rina@gmail.com` | `rina123` | User |
| `agus@gmail.com` | `agus123` | User |
| `siti@gmail.com` | `siti123` | Admin |

## Struktur Folder

```
tugas-uts-web1/
├── index.html        # Halaman Login (+ modal Lupa Password & Daftar)
├── dashboard.html    # Menu utama + greeting berdasarkan waktu
├── stok.html         # Katalog/Stok (render dinamis + tambah stok via DOM)
├── checkout.html     # Pemesanan (ubah item, form pemesan & pembayaran)
├── tracking.html     # Pelacakan pengiriman (cari No. DO)
├── riwayat.html      # History transaksi
├── css/
│   └── style.css     # Seluruh gaya (tema toko buku, modal, progress bar)
├── js/
│   ├── data.js       # Data dummy (Array JSON): katalog, tracking, riwayat
│   └── script.js     # Logika: login, DOM, validasi, modal, router per-halaman
├── assets/
│   └── logo.png
└── img/
    └── buku1.png … buku6.png
```

## Cara Menjalankan

1. Buka folder `tugas-uts-web1` di VS Code.
2. Klik kanan `index.html` → **Open with Live Server** (atau buka langsung di browser).
3. Login dengan akun demo di atas.

> Semua file HTML memuat `css/style.css`, `js/data.js`, dan `js/script.js`. Script dihubungkan dengan atribut `defer` agar DOM siap saat kode dijalankan.

## Penjelasan Tiap Halaman (ringkas — untuk video)

1. **Login (`index.html`)** — input email & password. Jika salah/kosong, muncul **alert** "email/password yang anda masukkan salah". Tombol **Lupa Password** dan **Daftar** tampil dalam bentuk **modal box**. Login sukses menyimpan status ke `localStorage` lalu pindah ke dashboard.
2. **Dashboard (`dashboard.html`)** — menu navigasi (Katalog, Tracking, Pemesanan, History) + **greeting** berdasarkan `new Date().getHours()` (pagi/siang/sore/malam).
3. **Katalog/Stok (`stok.html`)** — data dirender **dinamis** dari konstanta `dataKatalogBuku`. Tombol **+ Tambah Stok** membuka modal; buku baru ditambahkan ke katalog & tabel menggunakan **DOM** (`document.createElement`, `appendChild`).
4. **Pemesanan (`checkout.html`)** — item pesanan bisa **ditambah/ubah qty/hapus**, subtotal–ongkir–total dihitung otomatis. Form pemesan & pembayaran **divalidasi** (nama, alamat, telepon 10–14 digit, metode) lalu menampilkan modal ringkasan.
5. **Tracking (`tracking.html`)** — input **Nomor Delivery Order**, tombol **Cari** menampilkan nama pemesan, status, ekspedisi, tanggal kirim, jenis paket, total, dan **riwayat perjalanan** (timeline) dari field `perjalanan`. (Coba: `20230012`, `20230013`.)
6. **History (`riwayat.html`)** — tabel riwayat transaksi yang diturunkan dari `dataTracking` (tiap No. DO = satu transaksi).

## Konsep yang Diterapkan

- **HTML semantik**: `header`, `nav`, `main`, `section`, `footer`, tabel, form.
- **CSS**: external CSS, variabel (`:root`), grid responsif, komponen (card, modal, timeline, badge).
- **JavaScript DOM & Event**: `getElementById`/`querySelector`, `addEventListener` (`click`, `submit`, `input`, `change`), `createElement`/`appendChild`, `classList`.
- **Validasi form & alert**: `preventDefault()`, cek kosong/format, pesan error + pop-up.
- **Interaksi UI**: modal box, pop-up/alert, timeline pengiriman, login guard via `localStorage`.
- **Modularitas**: HTML, `style.css`, `data.js`, dan `script.js` dipisah; `script.js` memakai router sederhana berdasarkan atribut `data-page` pada `<body>`.

## Catatan

Data (pengguna, katalog buku, tracking) mengikuti berkas `js/data.js` yang diberikan. Cover buku pada folder `img/` memakai gambar asli sesuai nama file pada `data.js` (`pengantar_komunikasi.jpg`, `manajemen_keuangan.jpg`, `kepemimpinan.jpg`, `mikrobiologi.jpg`, `paud_perkembangan.jpeg`). Buku yang ditambahkan lewat fitur Tambah Stok memakai `img/no_cover.png` sebagai placeholder.
