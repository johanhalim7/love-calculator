# Kalkulator Cinta (Love Calculator)

Aplikasi web interaktif berbasis **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS** untuk menghitung persentase kecocokan pasangan berdasarkan nama menggunakan metode klasik.

## Fitur Utama

- **Perhitungan Klasik Simetris:** Menggabungkan kedua nama secara simetris (`(A, B) == (B, A)`) dengan kata kunci `loves` dan mereduksi frekuensi huruf menjadi skor `0%–100%`.
- **Animasi Hati Terisi (*Liquid Heart-Fill*):** Efek cairan bergelombang mengisi bentuk hati saat proses perhitungan dan pada tampilan hasil.
- **Dwibahasa (ID / EN):** Pengalih bahasa instan antara Bahasa Indonesia dan Bahasa Inggris.
- **Berbagi Hasil:** Salin link dengan query parameter (`?a=...&b=...&lang=...`) atau salin teks ringkasan siap kirim.
- **Riwayat Lokal:** Menyimpan hingga 10 hasil terakhir di `localStorage` browser tanpa mengirim data ke server mana pun.

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.

## Pengujian & Build

```bash
npm test
npm run lint
npm run build
```

> Catatan: Aplikasi ini dibuat khusus untuk hiburan semata.
