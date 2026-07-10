# Duccky AI

Duccky AI adalah asisten Discord yang di-host sendiri dan berjalan pada layanan AI lokal.

- Obrolan: **LM Studio**
- Pencarian web opsional: **SearXNG**

Repositori ini ditujukan bagi pengguna yang ingin bot Discord lokal tanpa API cloud.

## Isi repositori

- Implementasi bot Discord dengan TypeScript
- Integrasi obrolan LM Studio
- Integrasi pencarian SearXNG (opsional)
- Skema Prisma untuk pengembangan lokal
- Tes, linting, dan dokumentasi

## Persyaratan

- Node.js 22 atau lebih baru
- Aplikasi Discord dan token bot
- LM Studio berjalan secara lokal dengan model yang mendukung chat
- Opsional: SearXNG untuk pencarian web

## Cara cepat (Quick start)

### 1. Clone dan install

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/duccky-ai.git
dcd duccky-ai
npm install
```

Jika menggunakan pnpm:

```bash
corepack pnpm install
```

### 2. Buat `.env`

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Isi `.env` dengan nilai yang diperlukan:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_discord_application_id
GUILD_ID=your_test_server_id
DATABASE_URL="file:./dev.db"
LMSTUDIO_URL=http://127.0.0.1:1234/v1
AI_PROVIDER=lmstudio
MODEL=google/gemma-4-e2b
LOG_LEVEL=info
PORT=3000
```

`GUILD_ID` berguna saat pengembangan karena command terdaftar lebih cepat di satu server, tapi bersifat opsional untuk deployment global.

### 3. Konfigurasi Discord

1. Buat aplikasi di [Discord Developer Portal](https://discord.com/developers/applications).
2. Salin **Application ID** ke `CLIENT_ID`.
3. Buat atau reset token bot di halaman **Bot** dan salin ke `DISCORD_TOKEN`. Jangan commit token.
4. Aktifkan **Message Content Intent** di **Bot → Privileged Gateway Intents**.
5. Di bagian **Installation**, pakai scope `bot` dan `applications.commands`. Berikan izin View Channels, Send Messages, Embed Links, dan Read Message History.
6. Invite bot ke server Anda.

### 4. Konfigurasi LM Studio

1. Buka LM Studio dan muat model yang mendukung chat.
2. Buka **Developer → Local Server** dan jalankan server.
3. Salin **API Model Identifier** ke `MODEL`, contoh: `google/gemma-4-e2b`.
4. Biarkan `LMSTUDIO_URL` `http://127.0.0.1:1234/v1` jika bot dan LM Studio berjalan di mesin yang sama.

Uji server:

```powershell
Invoke-RestMethod http://127.0.0.1:1234/v1/models
```

### 5. Buat database dan jalankan bot

```bash
npm run prisma:generate
npm run build
npm run prisma:migrate deploy
npm run deploy:commands
npm run dev
```

Jika menggunakan pnpm:

```bash
corepack pnpm prisma:generate
corepack pnpm build
corepack pnpm prisma:migrate deploy
corepack pnpm deploy:commands
corepack pnpm dev
```

Setelah terminal menunjukkan `bot started`, buka Discord dan tes `/ping` atau sebut bot. Jalankan LM Studio dan biarkan terminal tetap menyala.

### 6. Aktifkan pencarian web dengan SearXNG (opsional)

Jalankan instance SearXNG, lalu set `SEARXNG_URL` di `.env` ke URL dasarnya (default `http://127.0.0.1:8080`). Bot mengirim permintaan ke `/search?format=json` sehingga instance SearXNG harus mendukung output JSON.

Contoh: tanyakan `cari berita AI terbaru` atau `latest Node.js release`.

## Perintah (Commands)

Duccky AI dirancang untuk digunakan dengan menyebut bot atau mengetik di channel AI. Slash command berguna untuk tindakan yang eksplisit, seperti menghapus memori atau mengubah pengaturan server.

| Command           | Fungsi                                        | Kapan digunakan                                      | Akses         |
| ----------------- | --------------------------------------------- | --------------------------------------------------- | ------------- |
| `@Duccky AI ...`  | Bertanya dari channel yang diizinkan          | Cara utama berinteraksi dengan bot                  | Semua orang   |
| `/ask prompt`     | Ajukan pertanyaan via slash command           | Alternatif untuk mention                            | Semua orang   |
| `/reset`          | Bersihkan memori obrolan di channel saat ini  | Saat bot membingungkan atau terjebak konteks lama    | Semua orang   |
| `/memory`         | Jelaskan apa yang disimpan memori percakapan  | Saat pengguna ingin tahu apa yang diingat bot       | Semua orang   |
| `/status`         | Tampilkan latency, uptime, channel, model, dsb| Pemeriksaan cepat setup server                      | Semua orang   |
| `/ping`           | Tampilkan latency gateway Discord             | Cek bahwa bot hidup                                 | Semua orang   |
| `/help`           | Petunjuk singkat penggunaan                   | Pengingat singkat untuk pengguna                    | Semua orang   |
| `/about`          | Informasi singkat tentang bot                 | Transparansi penggunaan LM Studio lokal            | Semua orang   |
| `/invite`         | Kembalikan URL invite bot                     | Saat ingin menambahkan bot ke server lain           | Semua orang   |
| `/config channel` | Set atau nonaktifkan channel AI khusus        | Konfigurasi server                                  | Administrator |
| `/model name`     | Ganti model LM Studio untuk server ini        | Konfigurasi server (Admin)                         | Administrator |
| `/reload`         | Jelaskan bahwa command dimuat saat restart     | Diagnostic untuk developer/admin                   | Administrator |
| `/shutdown`       | Matikan bot dengan aman                       | Maintenance oleh owner/admin                       | Administrator |

## Catatan deployment

Untuk satu server, set `GUILD_ID`. Untuk banyak server, hapus `GUILD_ID`, jalankan `corepack pnpm deploy:commands`, aktifkan **Public Bot**, dan bagikan tautan instalasi. Mesin host harus tetap online karena LM Studio berjalan lokal.

Untuk produksi, gunakan PostgreSQL terkelola dan workflow migrasi Prisma.

## Lisensi

Dilindungi oleh [MIT License](LICENSE).
