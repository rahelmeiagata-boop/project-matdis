# Kelompok 03 - LogicLab: Pemeriksa Proposisi Logika

## Deskripsi
LogicLab adalah aplikasi web sederhana untuk memeriksa ekspresi logika proposisional. Aplikasi menghasilkan tabel kebenaran dan mengklasifikasikan ekspresi menjadi tautologi, kontradiksi, atau kontingensi.

## Anggota Kelompok
- Amelia Rideka Ananta Tampubolon
- Maura Khairin Amri Simatupang
- Nazla Muthia
- Rahel Mey Agata Situmorang
- Suci Annisa

## Teknologi yang Digunakan
- HTML untuk struktur halaman.
- CSS untuk tampilan.
- JavaScript untuk proses analisis logika.

## Kebutuhan Library
Tidak memerlukan library atau instalasi tambahan. Aplikasi berjalan langsung di browser.

## Cara Menjalankan Program
1. Unduh atau klon repository project.
2. Pastikan file `index.html`, `style.css`, dan `script.js` berada dalam folder project yang sama.
3. Buka `index.html` menggunakan browser seperti Google Chrome atau Microsoft Edge.

Alternatif: buka aplikasi versi online melalui tautan demo di bawah.

## Tautan Project
- Demo aplikasi: https://project-matdis.vercel.app/
- Repository source code: https://github.com/rahelmeiagata-boop/project-matdis

## Fitur Utama
- Memasukkan ekspresi logika proposisional.
- Membuat tabel kebenaran secara otomatis.
- Mengklasifikasikan ekspresi menjadi tautologi, kontradiksi, atau kontingensi.
- Menampilkan detail dan persentase nilai benar/salah.
- Menyediakan contoh ekspresi dan konsep logika.
- Menampilkan riwayat analisis selama sesi penggunaan.

## Operator yang Didukung
- `~` : Negasi
- `∧` : Konjungsi
- `∨` : Disjungsi
- `→` : Implikasi
- `↔` : Biimplikasi

Variabel yang didukung adalah `A`, `B`, `C`, dan `D`, dengan maksimal empat variabel dalam satu ekspresi. Tanda kurung dapat digunakan untuk membentuk ekspresi.

## Contoh Input dan Hasil yang Diharapkan

| Input | Hasil |
|---|---|
| `A ∨ ~A` | Tautologi |
| `A ∧ ~A` | Kontradiksi |
| `A ∧ B` | Kontingensi |
| `A → B` | Kontingensi |
| `(A ∨ B) ∧ C` | Kontingensi |

## File Project
- `index.html` : struktur halaman aplikasi.
- `style.css` : gaya dan tata letak aplikasi.
- `script.js` : algoritma untuk memproses ekspresi, membuat tabel kebenaran, dan menentukan klasifikasi.

## Catatan
Project ini tidak menggunakan database, login, API, maupun dataset eksternal. Riwayat analisis hanya tersedia selama sesi penggunaan aplikasi.
