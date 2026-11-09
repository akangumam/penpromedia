# Panduan Deployment & Alur Kerja — Penpromedia

Dokumen ini menjelaskan alur kerja pengembangan lokal dan panduan deployment ke server VPS untuk website **Penpromedia** (`penpromedia.web.id`).

---

## 1. Alur Kerja (Workflow Overview)

Website ini menggunakan arsitektur **Static Site Generation (SSG)** dengan Astro. Alur pembaruan konten/undangan adalah:

```
[Komputer Lokal] 
      │ (git push)
      ▼
[GitHub Repository] (main branch)
      │ (ssh & git pull)
      ▼
[Server VPS / Nginx / Docker] (rebuild & serve)
```

---

## 2. Pengembangan di Komputer Lokal

### Prasyarat
* Node.js (versi 20 atau 22 disarankan)
* npm

### Menjalankan Server Development
```bash
npm install
npm run dev
```
Buka browser di `http://localhost:3000`.

### Mengetes Build Statis
Sebelum melakukan push ke Git, selalu pastikan build tidak mengalami error:
```bash
npm run build
```
Hasil build akan tersimpan di folder `dist/`.

---

## 3. Menambahkan Undangan Digital Baru

Setiap undangan digital di Penpromedia menggunakan file-based routing di Astro:

1. Buat folder baru di bawah `src/pages/`, misalnya `src/pages/nama-pasangan/index.astro`.
2. Kloning dari template undangan yang sudah ada (misalnya dari `src/pages/undangan1/index.astro`).
3. Sesuaikan data:
   * **Title & Meta Tag** (nama mempelai untuk preview media sosial & WhatsApp).
   * **Preloader & Cover** (nama pasangan dan tanggal).
   * **Profil Mempelai Pria & Wanita** (nama lengkap, orang tua, akun media sosial).
   * **Waktu & Lokasi Acara** (Akad & Resepsi, tautan Google Maps & Google Calendar).
   * **Countdown Timer** (sesuaikan target tanggal di script countdown).
   * **Amplop Digital / Hadiah** (nomor rekening & alamat pengiriman kado).
   * **Backsound Musik** (`videoId` YouTube).
4. Daftarkan kartu undangan baru di halaman katalog: [`src/pages/sampel-undangan.astro`](src/pages/sampel-undangan.astro).

---

## 4. Langkah Push ke GitHub

Setelah pengujian di lokal selesai:

```bash
# 1. Cek status perubahan
git status

# 2. Masukkan file ke staging
git add .

# 3. Buat commit pesan jelas
git commit -m "feat: tambah sampel undangan nama-pasangan"

# 4. Push ke GitHub
git push origin main
```

---

## 5. Langkah Deployment di Server VPS

Setelah perubahan ter-push ke GitHub, lakukan langkah berikut di server VPS:

### A. Masuk ke Server VPS
```bash
ssh user@ip-server-vps
```

### B. Masuk ke Folder Project & Tarik Update Terbaru
```bash
cd /path/ke/penpromedia
git pull origin main
```

### C. Rebuild Website

Pilih salah satu metode sesuai konfigurasi yang aktif di VPS Anda:

#### Opsi 1: Jika Menggunakan Docker Compose (Direkomendasikan)
```bash
docker compose down
docker compose up --build -d
```

#### Opsi 2: Jika Menggunakan Docker Biasa
```bash
# Rebuild container image dari Dockerfile
docker build -t penpromedia .

# Restart container
docker stop penpromedia && docker rm penpromedia
docker run -d -p 80:80 --name penpromedia penpromedia
```

#### Opsi 3: Jika Menggunakan Node.js & Nginx Langsung di VPS (Tanpa Docker)
```bash
npm install
npm run build
# Nginx otomatis menyajikan isi folder dist/ terbaru tanpa perlu restart service
```

---

## 6. Troubleshooting Umum

* **Error 404 Not Found pada Rute Baru (misal: `/rian-anisha`)**:
  * Pastikan file sudah ter-commit dan di-push ke GitHub.
  * Pastikan sudah menjalankan `git pull origin main` di VPS.
  * Pastikan proses build (`docker compose up --build -d` atau `npm run build`) selesai tanpa error.
  * Jika menggunakan Nginx langsung, pastikan konfigurasi Nginx mendukung fallback directory index:
    ```nginx
    try_files $uri $uri/ $uri/index.html =404;
    ```
* **Perubahan Tidak Muncul di Browser**:
  * Tekan `Ctrl + Shift + R` (Hard Reload) di browser untuk membersihkan cache lokal.
  * Jika menggunakan Cloudflare, lakukan *Purge Cache*.

