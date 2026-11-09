# Panduan Sistem Buku Tamu & Kelola Ucapan Terpusat - Penpromedia

Sistem ini digunakan untuk mengelola seluruh undangan pernikahan Penpromedia secara terpusat:
1. **Sebar Undangan (Link Generator)**: Men-generate link undangan personal per tamu ber-signature resmi (SHA-256) + pesan WhatsApp.
2. **Kelola Ucapan (Admin Moderasi)**: Melihat dan menghapus ucapan tamu yang masuk dari seluruh undangan klien.

---

## 1. Cara Akses Dashboard Admin Klien

Cukup buka satu URL ini di browser:
```text
https://penpromedia.web.id/buku-tamu/?id=[nama-klien]
```
Contoh:
* Rian & Anisha: `https://penpromedia.web.id/buku-tamu/?id=rian-anisha`
* Risma & Azis: `https://penpromedia.web.id/buku-tamu/?id=risma-azis`

---

## 2. Fitur di Dalam Dashboard `/buku-tamu`

### Tab 1: Sebar Undangan (Link Generator)
* **Input Nama Tamu**: Masukkan nama-nama tamu (1 nama per baris).
* **Pilihan Template WhatsApp**: Formal, Santai/Akrab, atau Tanpa Gelar.
* **Generate & Bagikan**:
  * 👁️ **Buka Link**: Preview undangan atas nama tamu tersebut.
  * 🔗 **Salin Link**: Copy link undangan ber-signature resmi.
  * 📋 **Salin Pesan**: Copy format teks WhatsApp lengkap siap kirim.
  * 💬 **Kirim WhatsApp**: Otomatis membuka aplikasi WhatsApp ke chat tamu.

### Tab 2: Kelola Ucapan Tamu
* **Total Ucapan**: Menampilkan jumlah ucapan yang sudah masuk.
* **Pencarian Nama**: Memfilter ucapan berdasarkan nama pengirim.
* **Hapus Ucapan**: Klik ikon tong sampah merah 🗑️ untuk menghapus ucapan spam / tidak pantas.
* **Proteksi Password**: Default password penghapusan adalah `penpromedia2026`.

---

## 3. Setup Master Google Spreadsheet (Opsional / Database Realtime)

Jika ingin semua ucapan tamu tersimpan online di Google Spreadsheet master Penpromedia:

1. Buka [Google Sheets](https://sheets.new) di akun Google Penpromedia.
2. Buat spreadsheet baru dan beri nama, misalnya: `Penpromedia - Master Guestbook`.
3. Klik menu **Extensions** (Ekstensi) > **Apps Script**.
4. Hapus semua kode default di editor, lalu *copy-paste* seluruh isi file:
   📁 **`google-apps-script/Code.gs`**
5. Anda bisa mengubah kata sandi admin pada baris ke-11:
   ```javascript
   const ADMIN_PASSWORD = "penpromedia2026";
   ```
6. Klik tombol **Deploy** (Terapkan) > **New deployment** (Penerapan baru).
7. Pada menu gerigi ⚙️ pilih **Web app**.
   * **Description**: `Penpromedia API v1`
   * **Execute as**: `Me (email Anda)`
   * **Who has access**: `Anyone` (Siapa saja)
8. Klik **Deploy**, lalu salin URL Web App yang dihasilkan:
   *(Format: `https://script.google.com/macros/s/XXX.../exec`)*.
9. Tempelkan URL tersebut pada variabel `MASTER_SCRIPT_URL` di `src/pages/buku-tamu/index.astro` dan file undangan klien.

> **Catatan:** Sistem Google Apps Script ini sudah **otomatis membuat tab sheet baru** sesuai ID klien (misal sheet `rian-anisha`, sheet `risma-azis`, dll) saat ada ucapan pertama kali masuk.
