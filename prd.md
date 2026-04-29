# 📄 Product Requirements Document (PRD)

**Nama Produk:** DevLance Hub
**Deskripsi Singkat:** An all-in-one offline-first PWA superapp tailored for Developers, Freelancers, and Professionals. Built with React, Vite, and Tailwind CSS, featuring 30+ productivity tools. No sign-ups required—everything is stored securely on your local device via LocalStorage, with seamless third-party API integrations.
**Platform:** Web Mobile & Desktop (Progressive Web App)
**Pembuat:** Fathin Satriani Hasan[cite: 1]
**Status:** Perencanaan (Draft v1.1)

---

## 1. Latar Belakang & Visi Produk

Sebagai seorang *Frontend Developer* dengan pengalaman 3,8 tahun di industri perbankan dan *fintech*[cite: 1], Fathin Satriani Hasan membutuhkan sebuah *platform* portofolio berskala *enterprise* yang dapat mendemonstrasikan keahlian teknis secara nyata. 

**Visi:** Membangun "Swiss Army Knife" digital berskala PWA yang ringan, *offline-first*, dan bebas riba untuk membantu produktivitas pekerja lepas (*freelancer*), *developer*, dan profesional umum. Produk ini tidak hanya berfungsi sebagai etalase *skill* (React, Vite, State Management, UI/UX)[cite: 1], tetapi juga memberikan nilai guna nyata bagi masyarakat dan membuka peluang monetisasi donasi.

## 2. Target Pengguna

- **Software Engineers / IT:** Membutuhkan alat bantu cepat untuk *testing*, format data, dan manajemen teknis harian.
- **Freelancers / Creatives:** Membutuhkan alat manajemen waktu, pembuat *invoice*, dan perhitungan tarif murni.
- **General Professionals:** Membutuhkan pengelola tugas, pencatat *meeting*, dan pengelola privasi.

---

## 3. Spesifikasi Teknis & Arsitektur

Aplikasi ini akan dibangun menggunakan tumpukan teknologi modern yang selaras dengan keahlian inti pembuat[cite: 1].

| Kategori | Teknologi Pilihan | Alasan / Catatan |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js & Vite[cite: 1] | Memastikan *render* cepat dan mendukung *Code Splitting/Lazy Loading* untuk menjaga ukuran aplikasi tetap ringan. |
| **Styling / UI Library** | Tailwind CSS / Material UI[cite: 1] | Mempercepat pembuatan komponen yang konsisten (*buttons*, *modals*, *forms*) dan mendukung fitur *Dark Mode*. |
| **State Management** | Redux (Toolkit/Saga) atau Zustand[cite: 1] | Mengelola *global state* (tema, profil pengguna, dan *state tools* favorit) secara efisien. |
| **Local Storage** | `localStorage` API | Penyimpanan data utama berbentuk struktur JSON. Kapasitas 5MB sangat cukup untuk data berbasis teks murni. |
| **Offline Support** | Service Worker & Web App Manifest | Agar aplikasi bisa diinstal di *homescreen* HP dan diakses tanpa koneksi internet[cite: 1]. |
| **Hosting & Deployment** | GitHub Pages[cite: 1] | *Hosting* statis gratis, andal, dengan URL portofolio `fhasans.github.io/DevLance-Hub`[cite: 1]. |

---

## 4. Ruang Lingkup Fitur (Information Architecture)

Aplikasi akan dibagi menjadi satu *Dashboard* utama dan tiga modul kategori besar.

### A. Core System (Sistem Inti)
- **PWA Setup:** Tombol *Install to Homescreen*.
- **Theme Switcher:** Pergantian Mode Terang / Gelap.
- **Global Profile:** Pengaturan nama, mata uang (IDR), dan URL avatar pengguna yang datanya akan digunakan di semua *tools*.
- **Pinned Favorites (Quick Access):** Fitur bagi pengguna untuk menyematkan (pin) *tools* yang paling sering digunakan (misal: *Time Tracker* atau *JSON Formatter*) langsung ke halaman *Dashboard* utama. Susunan pin ini akan disimpan secara persisten di `localStorage`.
- **Storage Monitor:** Indikator visual untuk melihat persentase penggunaan 5MB `localStorage`.

### B. Modul 1: IT & Developer Tools (Prioritas MVP)
1. **API Endpoint Tester:** Alat *fetch* REST API (GET/POST/PUT/DELETE) ringan dengan riwayat *response*.
2. **JSON Formatter & Validator:** Alat merapikan dan mengecek *error* dari format JSON.
3. **Regex Tester:** Alat validasi *string* dengan *pattern* *Regular Expression*.
4. **Code Snippet Vault:** Penyimpanan lokal potongan kode harian.
5. **Dummy Data Generator:** Menghasilkan JSON data palsu untuk *testing* UI menggunakan integrasi *Public API*.

### C. Modul 2: Creative & Freelance Tools
1. **Freelance Time Tracker:** *Stopwatch* proyek yang terintegrasi langsung dengan modul *Invoice*.
2. **Invoice Generator:** Pembuat tagihan PDF berbasis *HTML-to-PDF client-side*.
3. **Client CRM Lite:** Daftar kontak klien dan riwayat pekerjaan yang tersimpan di memori peramban.
4. **Cover Letter Builder:** Generator teks berdasarkan variabel *template* dinamis.

### D. Modul 3: General Productivity
1. **Kanban Board:** Pengelola tugas (To-Do, Doing, Done) berbasis *drag-and-drop*.
2. **Pomodoro Timer:** *Timer* fokus 25 menit dengan suara ambien opsional.
3. **Meeting Minutes Manager:** Pencatat notulen rapat dan pemisah bagian *Action Items*.
4. **Password Vault (Local):** Penyimpan kata sandi yang disandikan secara lokal menggunakan enkripsi AES *client-side*.

---

## 5. Kebutuhan Non-Fungsional (NFR)

1. **Performance:** 
   - Waktu muat awal (*First Contentful Paint*) harus di bawah 1.5 detik.
   - Wajib mengimplementasikan `React.lazy()` untuk setiap komponen modul agar *bundle size* utama tetap di bawah 500 KB dan tidak *lag*.
2. **Storage Constraint:**
   - Harus ada fungsi penangkap *error* (`try-catch`) saat menyimpan ke `localStorage` untuk mencegah aplikasi *crash* jika kuota `QuotaExceededError` tercapai.
3. **Responsiveness:**
   - Pendekatan *Mobile-First Design*. Elemen antarmuka sentuh harus berukuran ideal minimal 44x44 pixel.
4. **Keamanan:**
   - Data sensitif wajib menggunakan algoritma enkripsi *client-side* sebelum masuk ke `localStorage`.

---

## 6. Fase Pengembangan (Milestones)

- **Fase 1: Fondasi & Arsitektur (Minggu 1)**
  - Inisialisasi Vite, React, dan Tailwind[cite: 1].
  - Konfigurasi PWA (Manifest, Service Worker).
  - Pembuatan *layout* utama (*Sidebar*, *Navbar*, *Routing* dengan `react-router-dom`).
- **Fase 2: Minimum Viable Product / MVP (Minggu 2)**
  - Penyelesaian Modul *Global Profile*, sistem logika `localStorage`, dan fitur **Pinned Favorites** di Dashboard.
  - Penyelesaian 3 *Tools* utama: *Time Tracker*, *Kanban Board*, dan *JSON Formatter*.
- **Fase 3: Ekspansi Modul (Minggu 3 - 4)**
  - Mengembangkan *tools* yang terintegrasi dengan *Public API* independen.
  - Penyelesaian pembuat *Invoice* dan fungsi ekspor ke PDF.
- **Fase 4: Polishing & Deployment (Minggu 5)**
  - Audit *Lighthouse* (Target skor 90+ untuk *Performance*, *Accessibility*, PWA).
  - Penambahan tombol donasi (*BuyMeACoffee*).
  - *Deploy* ke GitHub Pages dan pembaruan tautan di CV Fathin[cite: 1].

---

## 7. Strategi Monetisasi & Portofolio

- **Monetisasi:** Integrasi tautan platform donasi eksternal (BuyMeACoffee: https://saweria.co/Fhasans) di profil atau *sidebar* bawah agar tidak mengganggu pengalaman pengguna, mematuhi batas aturan GitHub Pages.
- **Dampak Portofolio:** Tautan *Live Demo* dan repositori akan disematkan di CV[cite: 1] untuk menyoroti keahlian arsitektur *frontend* monorepo, penguasaan UX melalui fitur *Pinned Favorites*, performa web, dan kemampuan *Product Management*.