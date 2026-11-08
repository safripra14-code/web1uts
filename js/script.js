/* =====================================================
   script.js — Logika interaksi seluruh halaman
   Disesuaikan dengan struktur data pada data.js:
   dataPengguna, dataKatalogBuku, dataTracking
   ===================================================== */

/* ---------- Util ---------- */
function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }
function setMsg(el, teks, tipe) { el.textContent = teks; el.className = "msg " + (tipe || ""); }
function parseRupiah(str) { return Number(String(str).replace(/[^0-9]/g, "")) || 0; }
function rupiah(n) { return "Rp " + new Intl.NumberFormat("id-ID").format(n); }
function badgeStatus(status) {
    if (status === "Selesai" || status === "Selesai Antar") return "badge-ok";
    if (status === "Dikirim") return "badge-ship";
    return "badge-proc"; // Dalam Perjalanan / Diproses
}

/* ---------- Login guard ---------- */
function cekLogin() {
    const page = document.body.dataset.page;
    const sudahLogin = localStorage.getItem("uts_login") === "true";
    if (page !== "login" && !sudahLogin) window.location.href = "index.html";
}
function logout() {
    localStorage.removeItem("uts_login");
    localStorage.removeItem("uts_user");
    localStorage.removeItem("uts_role");
    window.location.href = "index.html";
}

/* ---------- Modal helper ---------- */
function bukaModal(id) { const m = qs("#" + id); if (m) m.classList.add("show"); }
function tutupModal(id) { const m = qs("#" + id); if (m) m.classList.remove("show"); }

/* =====================================================
   1. LOGIN (index.html) — validasi terhadap dataPengguna
   ===================================================== */
function initLogin() {
    if (localStorage.getItem("uts_login") === "true") {
        window.location.href = "dashboard.html";
        return;
    }
    const form = qs("#formLogin");
    const pesan = qs("#pesanLogin");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = qs("#email").value.trim();
        const password = qs("#password").value;

        if (email === "" || password === "") {
            setMsg(pesan, "Email dan password wajib diisi.", "bad");
            return;
        }
        // cari pengguna yang cocok di dataPengguna
        const user = dataPengguna.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem("uts_login", "true");
            localStorage.setItem("uts_user", user.nama);
            localStorage.setItem("uts_role", user.role);
            window.location.href = "dashboard.html";
        } else {
            alert("email/password yang anda masukkan salah");
            setMsg(pesan, "email/password yang anda masukkan salah", "bad");
        }
    });

    qs("#linkLupa").addEventListener("click", () => bukaModal("modalLupa"));
    qs("#linkDaftar").addEventListener("click", () => bukaModal("modalDaftar"));
    qs("#formLupa").addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Tautan reset password telah dikirim ke email Anda (simulasi).");
        tutupModal("modalLupa");
    });
    qs("#formDaftar").addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Pendaftaran berhasil (simulasi). Silakan login.");
        tutupModal("modalDaftar");
    });
    qsa("[data-close]").forEach(btn => btn.addEventListener("click", () => tutupModal(btn.dataset.close)));
}

/* =====================================================
   2. DASHBOARD — greeting waktu lokal
   ===================================================== */
function initDashboard() {
    const jam = new Date().getHours();
    let sapa;
    if (jam >= 5 && jam < 11) sapa = "Selamat pagi";
    else if (jam >= 11 && jam < 15) sapa = "Selamat siang";
    else if (jam >= 15 && jam < 18) sapa = "Selamat sore";
    else sapa = "Selamat malam";

    const user = localStorage.getItem("uts_user") || "Pengguna";
    const role = localStorage.getItem("uts_role") || "";
    qs("#greeting").textContent = sapa + "!";
    qs("#greetingSub").textContent =
        "Selamat datang kembali, " + user + (role ? " (" + role + ")" : "") + ". " +
        new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/* =====================================================
   3. STOK / KATALOG (stok.html)
   ===================================================== */
function initStok() {
    const grid = qs("#gridKatalog");
    const tbody = qs("#tbodyStok");

    function kartuHTML(b) {
        return '<div class="cover"><img src="' + b.cover + '" alt="' + b.namaBarang + '" onerror="this.src=\'img/no_cover.png\'"></div>' +
               '<div class="body">' +
                 '<h3>' + b.namaBarang + '</h3>' +
                 '<div class="author">' + b.jenisBarang + ' · Edisi ' + b.edisi + '</div>' +
                 '<div class="meta">Kode: ' + b.kodeBarang + ' · Stok: ' + b.stok + '</div>' +
                 '<div class="price">' + b.harga + '</div>' +
               '</div>';
    }
    function barisHTML(b) {
        return "<td>" + b.kodeBarang + "</td>" +
               "<td>" + b.namaBarang + "</td>" +
               "<td>" + b.jenisBarang + "</td>" +
               "<td class='text-center'>" + b.edisi + "</td>" +
               "<td class='text-center'>" + b.stok + "</td>" +
               "<td class='text-right'>" + b.harga + "</td>";
    }
    function tambahKartu(b) { const d = document.createElement("div"); d.className = "book-card"; d.innerHTML = kartuHTML(b); grid.appendChild(d); }
    function tambahBaris(b) { const tr = document.createElement("tr"); tr.innerHTML = barisHTML(b); tbody.appendChild(tr); }

    grid.innerHTML = ""; tbody.innerHTML = "";
    dataKatalogBuku.forEach(b => { tambahKartu(b); tambahBaris(b); });

    qs("#formStok").addEventListener("submit", function (e) {
        e.preventDefault();
        const pesan = qs("#pesanStok");
        const kode = qs("#sKode").value.trim().toUpperCase();
        const nama = qs("#sNama").value.trim();
        const jenis = qs("#sJenis").value.trim();
        const edisi = qs("#sEdisi").value.trim();
        const stok = Number(qs("#sStok").value);
        const harga = Number(qs("#sHarga").value);

        if (kode === "" || nama === "" || jenis === "") {
            setMsg(pesan, "Kode, nama, dan jenis barang wajib diisi.", "bad"); return;
        }
        if (Number.isNaN(stok) || stok < 0 || Number.isNaN(harga) || harga <= 0) {
            setMsg(pesan, "Stok dan harga harus berupa angka yang valid.", "bad"); return;
        }
        const bukuBaru = {
            kodeBarang: kode, namaBarang: nama, jenisBarang: jenis,
            edisi: edisi || "1", stok: stok, harga: rupiah(harga), cover: "img/no_cover.png"
        };
        dataKatalogBuku.push(bukuBaru);   // perbarui data
        tambahKartu(bukuBaru);            // tambah kartu via DOM
        tambahBaris(bukuBaru);            // tambah baris tabel via DOM
        this.reset();
        setMsg(pesan, "Buku \"" + nama + "\" berhasil ditambahkan.", "ok");
        tutupModal("modalStok");
    });

    qs("#btnTambahStok").addEventListener("click", () => bukaModal("modalStok"));
    qsa("[data-close]").forEach(btn => btn.addEventListener("click", () => tutupModal(btn.dataset.close)));
}

/* =====================================================
   4. CHECKOUT / PEMESANAN (checkout.html)
   ===================================================== */
function initCheckout() {
    const tbody = qs("#tbodyPesan");
    const ONGKIR = 20000;
    // pesanan awal diambil dari 2 buku pertama pada katalog
    let keranjang = dataKatalogBuku.slice(0, 2).map(b => ({
        kode: b.kodeBarang, nama: b.namaBarang, harga: parseRupiah(b.harga), qty: 1
    }));

    function render() {
        tbody.innerHTML = "";
        keranjang.forEach((item, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML =
                "<td>" + item.nama + "</td>" +
                "<td class='text-right'>" + rupiah(item.harga) + "</td>" +
                "<td class='text-center'><input type='number' min='1' value='" + item.qty +
                    "' data-i='" + i + "' class='qty' style='width:64px;padding:6px;text-align:center'></td>" +
                "<td class='text-right'>" + rupiah(item.harga * item.qty) + "</td>" +
                "<td class='text-center'><button class='btn btn-danger btn-sm' data-del='" + i + "'>Hapus</button></td>";
            tbody.appendChild(tr);
        });
        hitung();
        qsa(".qty").forEach(inp => inp.addEventListener("input", function () {
            const v = Number(this.value);
            keranjang[Number(this.dataset.i)].qty = (Number.isInteger(v) && v > 0) ? v : 1;
            render();
        }));
        qsa("[data-del]").forEach(btn => btn.addEventListener("click", function () {
            keranjang.splice(Number(this.dataset.del), 1); render();
        }));
    }
    function hitung() {
        const subtotal = keranjang.reduce((s, it) => s + it.harga * it.qty, 0);
        const ongkir = keranjang.length ? ONGKIR : 0;
        qs("#subtotal").textContent = rupiah(subtotal);
        qs("#ongkir").textContent = rupiah(ongkir);
        qs("#grandtotal").textContent = rupiah(subtotal + ongkir);
    }
    render();

    const sel = qs("#selBuku");
    dataKatalogBuku.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b.kodeBarang;
        opt.textContent = b.namaBarang + " — " + b.harga;
        sel.appendChild(opt);
    });
    qs("#btnTambahItem").addEventListener("click", function () {
        const kode = sel.value; if (!kode) return;
        const buku = dataKatalogBuku.find(b => b.kodeBarang === kode);
        const ada = keranjang.find(it => it.kode === kode);
        if (ada) ada.qty += 1;
        else keranjang.push({ kode: buku.kodeBarang, nama: buku.namaBarang, harga: parseRupiah(buku.harga), qty: 1 });
        render();
    });

    qs("#formPesan").addEventListener("submit", function (e) {
        e.preventDefault();
        const pesan = qs("#pesanCheckout");
        const nama = qs("#cNama").value.trim();
        const alamat = qs("#cAlamat").value.trim();
        const telp = qs("#cTelp").value.trim();
        const bayar = qs("#cBayar").value;

        if (keranjang.length === 0) { setMsg(pesan, "Keranjang masih kosong.", "warn"); return; }
        if (nama === "" || alamat === "") { setMsg(pesan, "Nama dan alamat pengiriman wajib diisi.", "bad"); return; }
        if (!/^[0-9]{10,14}$/.test(telp)) { setMsg(pesan, "Nomor telepon harus 10-14 digit angka.", "bad"); return; }
        if (bayar === "") { setMsg(pesan, "Pilih metode pembayaran.", "bad"); return; }

        const total = keranjang.reduce((s, it) => s + it.harga * it.qty, 0) + ONGKIR;
        qs("#modalResiIsi").innerHTML =
            "<p><b>" + nama + "</b></p><p class='hint'>" + alamat + " · " + telp + "</p>" +
            "<p style='margin-top:8px'>Metode: " + bayar + "</p>" +
            "<p style='font-size:18px;color:var(--primary-dark);font-weight:700;margin-top:8px'>Total: " + rupiah(total) + "</p>";
        bukaModal("modalResi");
    });
    qsa("[data-close]").forEach(btn => btn.addEventListener("click", () => tutupModal(btn.dataset.close)));
}

/* =====================================================
   5. TRACKING / PENGIRIMAN (tracking.html)
   ===================================================== */
function initTracking() {
    const hasil = qs("#hasilTracking");
    qs("#formCari").addEventListener("submit", function (e) {
        e.preventDefault();
        const no = qs("#inputDO").value.trim();
        const pesan = qs("#pesanCari");
        if (!no) { hasil.innerHTML = ""; setMsg(pesan, "Masukkan Nomor Delivery Order.", "warn"); return; }

        const data = dataTracking[no];
        if (!data) {
            hasil.innerHTML = "";
            setMsg(pesan, "Nomor DO \"" + no + "\" tidak ditemukan. Coba: 20230012 atau 20230013.", "bad");
            return;
        }
        setMsg(pesan, "", "");

        // timeline perjalanan
        let tl = "";
        data.perjalanan.forEach(p => {
            tl += "<li><span class='tl-dot'></span><div>" +
                  "<div class='tl-time'>" + p.waktu + "</div>" +
                  "<div class='tl-desc'>" + p.keterangan + "</div></div></li>";
        });

        hasil.innerHTML =
            "<div class='card'>" +
            "<div style='display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px'>" +
            "<h3 style='color:var(--primary-dark)'>No. DO: " + data.nomorDO + "</h3>" +
            "<span class='badge " + badgeStatus(data.status) + "'>" + data.status + "</span></div>" +
            "<p class='hint'>Pemesan: <b>" + data.nama + "</b></p>" +
            "<ul class='detail-list' style='margin-top:12px'>" +
            "<li><span>Ekspedisi</span><span>" + data.ekspedisi + "</span></li>" +
            "<li><span>Tanggal Kirim</span><span>" + data.tanggalKirim + "</span></li>" +
            "<li><span>Jenis Paket</span><span>" + data.paket + "</span></li>" +
            "<li><span>Total Pembayaran</span><span><b>" + data.total + "</b></span></li>" +
            "</ul>" +
            "<h4 style='margin:18px 0 6px;color:var(--primary-dark)'>Riwayat Perjalanan</h4>" +
            "<ul class='timeline'>" + tl + "</ul>" +
            "</div>";
    });
}

/* =====================================================
   6. HISTORY TRANSAKSI (riwayat.html)
   Diturunkan dari dataTracking (tiap DO = satu transaksi)
   ===================================================== */
function initRiwayat() {
    const tbody = qs("#tbodyRiwayat");
    Object.values(dataTracking).forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML =
            "<td>" + d.nomorDO + "</td>" +
            "<td>" + d.tanggalKirim + "</td>" +
            "<td>" + d.nama + "</td>" +
            "<td class='text-right'>" + d.total + "</td>" +
            "<td class='text-center'><span class='badge " + badgeStatus(d.status) + "'>" + d.status + "</span></td>";
        tbody.appendChild(tr);
    });
}

/* =====================================================
   Router: jalankan init sesuai data-page
   ===================================================== */
document.addEventListener("DOMContentLoaded", function () {
    cekLogin();
    const tombolLogout = qs("#btnLogout");
    if (tombolLogout) tombolLogout.addEventListener("click", logout);

    const page = document.body.dataset.page;
    if (page === "login") initLogin();
    else if (page === "dashboard") initDashboard();
    else if (page === "stok") initStok();
    else if (page === "checkout") initCheckout();
    else if (page === "tracking") initTracking();
    else if (page === "riwayat") initRiwayat();
});
