# Kebijakan Keamanan

[English](SECURITY.md)

## Versi yang didukung

Perbaikan keamanan diterapkan pada versi terbaru di branch default.

## Melaporkan kerentanan

Jangan mengungkapkan kerentanan melalui issue publik, pesan Discord, atau pull request. Hubungi pemilik repositori secara pribadi dengan deskripsi yang jelas, langkah reproduksi, dampak, dan mitigasi yang disarankan. Maintainer akan mengonfirmasi laporan, menyelidikinya, dan mengoordinasikan penyelesaian yang bertanggung jawab.

## Tanggung jawab operator

- Perlakukan `DISCORD_TOKEN` sebagai kata sandi; segera rotasi bila terekspos.
- Simpan `.env` di luar source control.
- Batasi akses ke host yang menjalankan bot dan LM Studio.
- Jangan ekspos server LM Studio secara publik tanpa autentikasi dan kontrol jaringan yang tepat.
- Gunakan instance SearXNG tepercaya dengan akses terkontrol; query pencarian web keluar dari host bot bila memakai instance eksternal.
- Tinjau izin Discord sebelum mengundang bot ke server.
- Selalu perbarui Node.js, dependensi, dan sistem operasi.

Duccky AI memvalidasi prompt dan tidak menampilkan stack trace di Discord, tetapi operator server tetap bertanggung jawab atas kontrol akses, retensi, moderasi, dan infrastruktur deployment.
