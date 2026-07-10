# Referensi API

[English](API.md)

Duccky AI tidak menyediakan API bisnis publik. Server Fastify kecilnya dipakai untuk pemantauan kesehatan, sedangkan inferensi AI diteruskan ke server LM Studio lokal.

## Pemeriksaan kesehatan

### `GET /health`

Mengembalikan status layanan dan gateway Discord.

```json
{ "status": "ok", "discord": "ready" }
```

Server hanya mendengarkan pada `127.0.0.1` dan `PORT` yang dikonfigurasi (default `3000`). Endpoint ini memang hanya untuk penggunaan lokal.

## Integrasi LM Studio

Provider mengirim `POST` ke `{LMSTUDIO_URL}/chat/completions` dengan format JSON standar yang kompatibel dengan OpenAI, misalnya:

```json
{ "model": "qwen3", "messages": [{ "role": "user", "content": "Halo" }], "temperature": 0.7 }
```

Ganti nilai `model` dengan identifier model yang dimuat di LM Studio. Respons yang tidak valid ditangani sebagai error aman di Discord, tanpa stack trace internal.

## Integrasi SearXNG

Untuk informasi terkini, bot memanggil `{SEARXNG_URL}/search` dengan `q`, `format=json`, `categories=general`, dan `safesearch=1`. Instance SearXNG harus mengaktifkan output JSON. Snippet dan URL hasil diberikan sebagai konteks ke LM Studio; bot tidak mengambil halaman hasilnya.
