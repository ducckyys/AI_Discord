# Berkontribusi

[English](CONTRIBUTING.md)

Terima kasih telah membantu Duccky AI. Kontribusi harus mempertahankan desain self-hosted khusus LM Studio dan pengalaman yang andal bagi komunitas Discord.

## Setup pengembangan

1. Fork repositori dan buat feature branch.
2. Instal Node.js 22 dan dependensi dengan `corepack pnpm install`.
3. Salin `.env.example` ke `.env`, lalu pakai kredensial pengujian non-produksi.
4. Buat Prisma Client dengan `corepack pnpm prisma:generate`.

## Standar engineering

- Gunakan TypeScript strict dan `async`/`await`.
- Validasi input eksternal dengan Zod.
- Error di Discord harus ringkas; simpan diagnostik pada log tanpa mengekspos stack trace atau token.
- Pertahankan batas repository dan service; jangan taruh logika persistence atau provider langsung di event handler.
- Tambahkan atau perbarui tes bila perilaku berubah.
- Jangan commit `.env`, token bot, file SQLite lokal, atau output build.

## Sebelum membuka pull request

```bash
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

Jelaskan dampak bagi pengguna, perubahan konfigurasi, dan cara menguji perubahan. Jaga pull request tetap fokus serta perbarui dokumentasi yang relevan.
