# Duccky AI

[English](README.md)

Duccky AI adalah asisten Discord yang di-host sendiri dan menggunakan server [LM Studio](https://lmstudio.ai/) yang berjalan secara lokal. Percakapan serta konfigurasi disimpan di database SQLite lokal, dengan pencarian web opsional melalui SearXNG.

## Fitur

- Chat dengan mention bot, channel AI khusus, atau `/ask`
- Analisis lampiran gambar opsional melalui `/ask`
- Pengaturan channel AI dan model LM Studio untuk setiap server
- Memori percakapan per channel yang dapat dihapus dengan `/reset`
- Pencarian web opsional melalui instance SearXNG sendiri
- Slash command untuk pemeriksaan, konfigurasi, moderasi, dan pemeliharaan
- Default sepenuhnya lokal: tidak memerlukan API key AI cloud

## Persyaratan

- Node.js 22 atau lebih baru
- pnpm 9 atau lebih baru (disarankan), atau npm
- Aplikasi Discord dan token bot
- LM Studio lokal dengan model chat yang sudah dimuat
- Opsional: instance SearXNG untuk `/search`

## Instalasi

### 1. Pasang dependensi

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/duccky-ai.git
cd duccky-ai
corepack pnpm install
```

Jika memakai npm:

```bash
npm install
```

### 2. Buat dan atur `.env`

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Isi setidaknya nilai wajib berikut:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_discord_application_id
GUILD_ID=your_development_server_id
DATABASE_URL="file:./dev.db"
LMSTUDIO_URL=http://localhost:1234/v1
MODEL=qwen3
```

`GUILD_ID` bersifat opsional. Jika diisi, command terdaftar hanya pada server tersebut dan muncul lebih cepat. Tanpa nilai ini, command terdaftar secara global dan dapat memerlukan waktu lebih lama untuk muncul.

Daftar konfigurasi yang tersedia:

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `DISCORD_TOKEN` | Ya | Token bot Discord. Jaga kerahasiaannya. |
| `CLIENT_ID` | Ya | Application ID Discord. |
| `GUILD_ID` | Tidak | ID server pengembangan untuk command khusus server. |
| `DATABASE_URL` | Ya | URL Prisma SQLite, biasanya `file:./dev.db`. |
| `LMSTUDIO_URL` | Tidak | Base URL LM Studio yang kompatibel dengan OpenAI. Default: `http://localhost:1234/v1`. |
| `AI_PROVIDER` | Tidak | Penyedia AI. Saat ini hanya mendukung `lmstudio`. |
| `MODEL` | Tidak | Identifier model LM Studio sebagai fallback. Default: `qwen3`. |
| `CREATOR_ID` | Tidak | ID pengguna Discord yang ditampilkan oleh `/about`. |
| `SEARXNG_URL` | Tidak | Base URL SearXNG untuk `/search`. |
| `SEARXNG_TIMEOUT_MS` | Tidak | Batas waktu pencarian dalam milidetik. Default: `10000`. |
| `SEARXNG_MAX_RESULTS` | Tidak | Jumlah hasil pencarian yang dikirim ke bot, 1 hingga 10. Default: `5`. |
| `LOG_LEVEL` | Tidak | Level log Pino. Default: `info`. |
| `PORT` | Tidak | Port endpoint kesehatan lokal. Default: `3000`. |

### 3. Konfigurasi Discord

1. Buat aplikasi di [Discord Developer Portal](https://discord.com/developers/applications).
2. Salin **Application ID** ke `CLIENT_ID`.
3. Pada halaman **Bot**, buat atau reset token dan isi sebagai `DISCORD_TOKEN`.
4. Aktifkan **Message Content Intent** pada **Bot → Privileged Gateway Intents**.
5. Di bagian **Installation**, tambahkan scope `bot` dan `applications.commands`. Berikan izin View Channels, Send Messages, Embed Links, serta Read Message History.
6. Install bot ke server melalui tautan instalasi yang dihasilkan.

### 4. Jalankan LM Studio

1. Muat model yang mendukung chat di LM Studio.
2. Buka **Developer → Local Server** lalu jalankan server.
3. Salin API model identifier yang ditampilkan ke `MODEL` apabila berbeda dari `qwen3`.

Jika LM Studio dan bot dijalankan pada komputer yang sama, gunakan `LMSTUDIO_URL` `http://localhost:1234/v1`. Uji server dengan:

```powershell
Invoke-RestMethod http://localhost:1234/v1/models
```

### 5. Buat database dan jalankan bot

```bash
corepack pnpm prisma:generate
corepack pnpm prisma:migrate
corepack pnpm deploy:commands
corepack pnpm dev
```

Untuk build produksi:

```bash
corepack pnpm build
corepack pnpm start
```

Jika memakai npm, gunakan perintah setara `npm run <script>`. Jalankan kembali `corepack pnpm deploy:commands` setelah mengubah slash command.

## Pencarian web opsional

Jalankan instance SearXNG yang mendukung output JSON, lalu isi `SEARXNG_URL` dengan base URL-nya. Duccky AI mengakses endpoint `/search?format=json` milik SearXNG.

Setelah selesai, gunakan `/search query:<kata-kunci>`. Bila pencarian gagal, biasanya URL tidak dapat dijangkau atau instance tidak menyediakan hasil pencarian JSON.

## Cara menggunakan

Secara default, mention bot di channel server:

```text
@Duccky AI Jelaskan TypeScript generics secara sederhana.
```

Administrator dapat menentukan channel AI khusus dengan `/config channel`. Pesan di channel tersebut dikirim ke bot tanpa mention. Jalankan `/config channel` tanpa memilih channel untuk kembali ke mode mention saja.

Anda juga dapat memakai `/ask prompt:<teks>` serta menambahkan lampiran gambar bila diperlukan.

## Perintah

| Perintah | Keterangan | Akses |
| --- | --- | --- |
| `@Duccky AI <pesan>` | Chat dengan bot dari channel yang diizinkan. | Semua pengguna |
| `/ask prompt:<teks> [image]` | Bertanya melalui slash command; lampiran gambar bersifat opsional. | Semua pengguna |
| `/search query:<kata-kunci>` | Mencari web melalui SearXNG. | Semua pengguna |
| `/reset` | Menghapus konteks percakapan Anda di channel saat ini. | Semua pengguna |
| `/memory` | Menjelaskan perilaku memori percakapan. | Semua pengguna |
| `/status` | Menampilkan uptime, latensi, channel, model, dan batasan. | Semua pengguna |
| `/ping` | Menampilkan latensi gateway Discord. | Semua pengguna |
| `/help` | Menampilkan bantuan penggunaan di Discord. | Semua pengguna |
| `/about` | Menampilkan informasi bot dan pembuatnya. | Semua pengguna |
| `/invite` | Mengembalikan tautan invite bot. | Semua pengguna |
| `/config channel [channel]` | Mengatur atau menonaktifkan channel AI khusus. | Administrator |
| `/model name:<model-id>` | Mengatur model LM Studio untuk server ini. | Administrator |
| `/reload` | Menjelaskan prosedur memuat ulang command. | Administrator |
| `/shutdown` | Menghentikan proses bot dengan aman. | Administrator |

Prioritas pemilihan model adalah: model yang diatur melalui `/model`, lalu model yang ditemukan dari LM Studio, kemudian `MODEL` dalam `.env`.

## Pengembangan

```bash
corepack pnpm lint
corepack pnpm format:check
corepack pnpm test
```

Lihat [indeks dokumentasi](docs/README.md) untuk arsitektur, API, kontribusi, privasi, keamanan, dan ketentuan layanan.

## Lisensi

Didistribusikan dengan [Lisensi MIT](LICENSE).
