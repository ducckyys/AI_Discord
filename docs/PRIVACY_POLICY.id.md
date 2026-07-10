# Kebijakan Privasi

[English](PRIVACY_POLICY.md)

**Tanggal berlaku:** 10 Juli 2026

Kebijakan ini menjelaskan perilaku penanganan data default instalasi Duccky AI yang di-host sendiri. Orang atau organisasi yang mengoperasikan deployment adalah pengendali data dan wajib menyediakan detail kontak serta pengungkapan tambahan yang diwajibkan hukum setempat.

## Informasi yang diproses

Duccky AI memproses identifier Discord yang diperlukan, termasuk ID server, channel, pengguna, username, ID pesan, dan isi pesan yang dikirim ke bot. Bot juga menyimpan konfigurasi server seperti channel AI serta identifier model yang dipilih.

## Cara informasi digunakan

Data hanya digunakan untuk merespons prompt, mempertahankan konteks percakapan, menerapkan batas operasional, dan menjalankan bot. Isi prompt dikirim ke endpoint LM Studio yang dikonfigurasi operator; pada konfigurasi lokal default, endpoint ini berjalan di mesin yang sama. Jika permintaan informasi terkini memicu pencarian web, query juga dikirim ke instance SearXNG yang dikonfigurasi.

## Penyimpanan dan retensi

Pesan percakapan serta pengaturan disimpan pada database deployment; default-nya database SQLite lokal. Command `/reset` menghapus pesan percakapan pengguna peminta di channel server saat ini. Operator dapat menyimpan backup, log, atau menggunakan database lain dan harus menjelaskan praktik retensinya sendiri.

## Pembagian data

Duccky AI tidak mengirim prompt ke OpenAI atau penyedia AI cloud lain. Informasi dapat diakses oleh operator dan penyedia infrastruktur yang dipilih operator, misalnya host database, host server, atau instance SearXNG eksternal.

## Pilihan Anda

Hubungi administrator server atau operator bot untuk meminta akses, koreksi, atau penghapusan bila berlaku. Jangan kirim data pribadi sensitif kecuali Anda memercayai deployment dan kebijakan retensi operator.

## Perubahan

Operator dapat memperbarui kebijakan ini ketika praktik data bot berubah. Penggunaan berkelanjutan setelah kebijakan terbaru dipublikasikan dianggap sebagai penerimaan kebijakan tersebut.
