# Arsitektur

[English](ARCHITECTURE.md)

Duccky AI menggunakan arsitektur TypeScript modular untuk bot Discord self-hosted. Desainnya memisahkan transport Discord dari orkestrasi AI, penyimpanan data, dan kontrol operasional.

## Alur permintaan

```text
Mention Discord atau slash command
  → event / command handler
  → validasi, izin, cooldown, rate limit
  → repository pengaturan dan percakapan
  → layanan AskAI
  → endpoint LM Studio yang kompatibel dengan OpenAI
  → respons disimpan dan dibalas ke Discord
```

## Komponen

| Area | Tanggung jawab |
| --- | --- |
| `src/events` | Menerima event gateway Discord dan merutekan interaksi/pesan. |
| `src/commands` | Mendeklarasikan slash command dan aturan aksesnya. |
| `src/ai` | System prompt, abstraksi provider, perakitan konteks, dan permintaan AI. |
| `src/database` | Prisma client dan implementasi repository. |
| `src/services` | Layanan aplikasi untuk server, pengguna, pengaturan, dan orkestrasi AI. |
| `src/middleware` | Bantuan cooldown, rate limit, izin, dan pencatatan command. |
| `src/config` | Konfigurasi aplikasi bertipe dari environment variable. |

## Model data

Prisma menyimpan lima entitas utama: **Guild** (server Discord), **User** (pengguna Discord), **Settings** (pengaturan AI tiap server), **Conversation** (konteks pengguna dalam channel server), dan **Message** (pesan pengguna maupun asisten).

Memori percakapan dibatasi oleh `guildId`, `userId`, dan `channelId`; pesan dari server atau channel lain tidak dipakai sebagai konteks.

## Batas provider AI

`AIProvider` mendefinisikan antarmuka kecil untuk mengirim pesan chat. `LMStudioProvider` adalah satu-satunya implementasi aktif dan menggunakan endpoint `/v1/chat/completions` yang kompatibel dengan OpenAI. Provider lain dapat mengimplementasikan antarmuka ini tanpa mengubah logika command, event, maupun repository.

Untuk permintaan informasi terkini, `ToolManager` memanggil SearXNG yang dikonfigurasi, mengirim snippet hasil ke LM Studio, dan menambahkan tautan hasil pada balasan Discord. Chat biasa tidak memerlukan SearXNG. Direktori `dist` hanya berisi output hasil build.

Prioritas model: model yang ditetapkan administrator dengan `/model`; lalu model siap pakai yang ditemukan dari endpoint LM Studio `/models`; lalu nilai fallback `MODEL` dalam `.env`.

## Model deployment

Pengembangan menggunakan SQLite. Untuk produksi, gunakan PostgreSQL, datasource dan alur migrasi Prisma khusus produksi, process supervision, secret terenkripsi, serta log persisten. Server LM Studio harus dapat dijangkau dari host bot dan tidak boleh diekspos publik tanpa autentikasi serta kontrol jaringan.
