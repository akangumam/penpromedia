# Panduan Lengkap Deployment — Penpromedia

Dokumen ini adalah panduan resmi alur kerja dan deployment untuk website **Penpromedia** (`penpromedia.web.id`). Simpan dan gunakan panduan ini agar proses update selalu konsisten.

---

## 1. Data Konfigurasi Server (Wajib Tahu)

Berdasarkan arsitektur VPS aktif saat ini:

| Parameter | Nilai / Konfigurasi |
| :--- | :--- |
| **User VPS** | `ubuntu` |
| **Lokasi Folder di VPS** | `/home/ubuntu/penpromedia` |
| **Docker Image Name** | `penpromedia-app` |
| **Docker Container Name** | `penpromedia-container` |
| **Port Mapping** | `-p 8080:80` (Port VPS `8080` mengarah ke Nginx Container port `80`) |
| **Reverse Proxy** | **Nginx Proxy Manager** (meneruskan `penpromedia.web.id` -> `http://localhost:8080`) |
| **Branch Git** | `main` |

---

## 2. Alur Update Rutin (Step-by-Step)

### Bagian A: Di Komputer Lokal (Laptop/PC)
Jalankan di terminal project lokal setelah selesai mengubah kode/konten:

```bash
# 1. Simpan perubahan ke Git
git add .
git commit -m "update: penjelasan perubahan"

# 2. Upload ke GitHub
git push origin main
```

---

### Bagian B: Di Server VPS
Buka terminal SSH VPS Anda, lalu copy-paste perintah berikut:

```bash
# 1. Masuk ke folder project
cd /home/ubuntu/penpromedia

# 2. Tarik update terbaru dari GitHub
git pull origin main

# 3. Build ulang Docker image (wajib --no-cache agar file baru terbaca)
docker build --no-cache -t penpromedia-app .

# 4. Ganti container lama dengan yang baru
docker stop penpromedia-container && docker rm penpromedia-container && docker run -d -p 8080:80 --name penpromedia-container penpromedia-app
```

> **Shortcut Otomatis di VPS:**  
> Jika Anda sudah berada di folder `/home/ubuntu/penpromedia`, Anda juga cukup menjalankan script:
> ```bash
> bash deploy.sh
> ```

---

## 3. Cara Menambahkan Undangan / Sampel Baru

Untuk membuat undangan baru berikutnya:

1. **Duplikat Template**:
   Copy folder `src/pages/undangan1/` atau `src/pages/rian-anisha/` menjadi folder baru:
   * Contoh: `src/pages/nama-pasangan/index.astro`
2. **Sesuaikan Konten di File `index.astro`**:
   * Title & Meta Tag (`<title>`, `<meta name="description">`, `<meta property="og:title">`)
   * Cover & Hero (`The Wedding of ...`, tanggal acara)
   * Biodata Pria & Wanita (nama lengkap, orang tua)
   * Jadwal Acara (Akad, Resepsi, alamat, link Google Maps & Google Calendar)
   * Countdown Timer (sesuaikan target `new Date("YYYY-MM-DDTHH:mm:ss")` di script bawah)
   * Rekening Gift (bank, no. rekening, nama penerima, alamat kirim kado)
3. **Daftarkan di Katalog Sampel**:
   * Buka file `src/pages/sampel-undangan.astro`.
   * Ganti preview link kartu menjadi `/nama-pasangan`.
4. **Deploy**:
   * Ikuti langkah pada **Bagian A** dan **Bagian B** di atas.

---

## 4. Troubleshooting Cepat

* **Muncul `404 Not Found (nginx/1.31.5)`**:
  * Artinya container baru belum dijalankan atau build terkena cache. Jalankan ulang perintah di **Bagian B**.
* **Error `No such container: ...` saat docker restart**:
  * Nama container harus sesuai: **`penpromedia-container`**.
* **Port Bentrok (`bind: address already in use`)**:
  * Pastikan container lama sudah di-stop dan di-remove terlebih dahulu (`docker stop penpromedia-container && docker rm penpromedia-container`).
