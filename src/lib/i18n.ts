import type { ScoreTier, ValidationErrorKey } from "./algorithms";

export type Locale = "id" | "en";

export interface CopyDictionary {
  brandBadge: string;
  title: string;
  subtitle: string;
  langLabel: string;
  form: {
    nameALabel: string;
    nameAPlaceholder: string;
    nameBLabel: string;
    nameBPlaceholder: string;
    swapAria: string;
    submit: string;
    calculating: string;
    calculatingSteps: [string, string, string];
    reset: string;
  };
  errors: Record<ValidationErrorKey, string>;
  tiers: Record<
    ScoreTier,
    {
      badge: string;
      headline: string;
      message: string;
    }
  >;
  result: {
    heading: string;
    scoreLabel: string;
    breakdownToggleShow: string;
    breakdownToggleHide: string;
    classicPhraseLabel: string;
    classicStepsLabel: string;
    copyLink: string;
    copyText: string;
    copiedLink: string;
    copiedText: string;
    tryAnother: string;
    shareTemplate: (params: {
      nameA: string;
      nameB: string;
      score: number;
      badge: string;
      url: string;
    }) => string;
  };
  history: {
    title: string;
    subtitle: string;
    clearAll: string;
    empty: string;
    loadAria: string;
    removeAria: string;
  };
  disclaimer: string;
}

export const DICTIONARIES: Record<Locale, CopyDictionary> = {
  id: {
    brandBadge: "Edisi Hiburan • 100% Privat di Browser",
    title: "Kalkulator Cinta",
    subtitle:
      "Cek seberapa serasi namamu dengan pasangan atau gebetan lewat perhitungan klasik kalkulator cinta.",
    langLabel: "Bahasa",
    form: {
      nameALabel: "Nama Kamu",
      nameAPlaceholder: "Ketik nama kamu...",
      nameBLabel: "Nama Pasangan",
      nameBPlaceholder: "Ketik nama pasangan...",
      swapAria: "Tukar posisi kedua nama",
      submit: "Hitung Kecocokan",
      calculating: "Meracik kecocokan hati...",
      calculatingSteps: [
        "Menyatukan inisial & huruf...",
        "Mengisi meteran cinta...",
        "Membaca sinyal kecocokan...",
      ],
      reset: "Reset",
    },
    errors: {
      empty_a: "Masukkan nama kamu terlebih dahulu.",
      empty_b: "Masukkan nama pasangan terlebih dahulu.",
      too_long_a: "Nama kamu maksimal 50 karakter.",
      too_long_b: "Nama pasangan maksimal 50 karakter.",
      no_letters_a: "Nama kamu harus mengandung minimal satu huruf.",
      no_letters_b: "Nama pasangan harus mengandung minimal satu huruf.",
    },
    tiers: {
      low: {
        badge: "Butuh Usaha Ekstra",
        headline: "Perbedaan yang Menantang",
        message:
          "Kalian mungkin datang dari dua dunia yang sangat berbeda, tapi komunikasi yang hangat selalu bisa menjembatani jarak.",
      },
      spark: {
        badge: "Ada Percikan Awal",
        headline: "Mulai Tumbuh Rasa Penasaran",
        message:
          "Chemistry kalian masih dalam tahap pemanasan. Sedikit perhatian kecil dan obrolan santai bisa membuat skor ini naik drastis!",
      },
      promising: {
        badge: "Serasi & Menjanjikan",
        headline: "Ritme yang Saling Melengkapi",
        message:
          "Kombinasi nama kalian menunjukkan keseimbangan yang manis. Kalian punya peluang besar untuk membangun hubungan yang nyaman dan solid.",
      },
      soulmate: {
        badge: "Pasangan Impian",
        headline: "Kecocokan Tingkat Soulmate!",
        message:
          "Luar biasa! Harmoni nama kalian berada di level puncak—seperti dua potongan puzzle yang memang ditakdirkan saling bertemu.",
      },
    },
    result: {
      heading: "Hasil Kecocokan",
      scoreLabel: "Skor Kecocokan",
      breakdownToggleShow: "Lihat cara hitung",
      breakdownToggleHide: "Sembunyikan cara hitung",
      classicPhraseLabel: "Rangkaian huruf simetris",
      classicStepsLabel: "Tahapan penjumlahan digit",
      copyLink: "Salin Link",
      copyText: "Salin Teks",
      copiedLink: "Link Tersalin!",
      copiedText: "Teks Tersalin!",
      tryAnother: "Coba Nama Lain",
      shareTemplate: ({ nameA, nameB, score, badge, url }) =>
        `💘 Kalkulator Cinta\n${nameA} + ${nameB} = ${score}% (${badge})\nCoba cek punyamu di: ${url}`,
    },
    history: {
      title: "Riwayat Terakhir",
      subtitle: "Tersimpan lokal di perangkatmu (maks. 10 hasil)",
      clearAll: "Hapus Semua",
      empty: "Belum ada riwayat perhitungan. Coba hitung pasangan pertamamu!",
      loadAria: "Muat ulang hasil ini",
      removeAria: "Hapus item riwayat",
    },
    disclaimer:
      "Catatan: Aplikasi ini dibuat khusus untuk hiburan semata. Data nama tidak pernah dikirim ke server mana pun.",
  },
  en: {
    brandBadge: "Just for Fun • 100% Private in Browser",
    title: "Love Calculator",
    subtitle:
      "Check how well your names match with your partner or crush using the classic love calculator method.",
    langLabel: "Language",
    form: {
      nameALabel: "Your Name",
      nameAPlaceholder: "Enter your name...",
      nameBLabel: "Partner's Name",
      nameBPlaceholder: "Enter partner's name...",
      swapAria: "Swap both names",
      submit: "Calculate Match",
      calculating: "Reading the chemistry...",
      calculatingSteps: [
        "Blending both names...",
        "Filling the love meter...",
        "Revealing your match...",
      ],
      reset: "Reset",
    },
    errors: {
      empty_a: "Please enter your name first.",
      empty_b: "Please enter your partner's name first.",
      too_long_a: "Your name must be 50 characters or fewer.",
      too_long_b: "Partner's name must be 50 characters or fewer.",
      no_letters_a: "Your name must contain at least one letter.",
      no_letters_b: "Partner's name must contain at least one letter.",
    },
    tiers: {
      low: {
        badge: "Needs Extra Spark",
        headline: "An Intriguing Contrast",
        message:
          "You two might come from very different worlds, yet thoughtful communication can always bridge the gap.",
      },
      spark: {
        badge: "Early Sparks",
        headline: "Curiosity Is Growing",
        message:
          "Your chemistry is just warming up. A few shared laughs and small gestures could easily turn up the heat!",
      },
      promising: {
        badge: "Sweet & Promising",
        headline: "A Balanced Rhythm",
        message:
          "Your names blend together with warm balance. There is great potential here for an easygoing, lasting bond.",
      },
      soulmate: {
        badge: "Dream Match",
        headline: "Soulmate-Level Chemistry!",
        message:
          "Incredible! Your name harmony hits the top tier—like two puzzle pieces clearly meant to find each other.",
      },
    },
    result: {
      heading: "Match Result",
      scoreLabel: "Compatibility Score",
      breakdownToggleShow: "Show how it's calculated",
      breakdownToggleHide: "Hide calculation details",
      classicPhraseLabel: "Symmetric letter sequence",
      classicStepsLabel: "Digit reduction steps",
      copyLink: "Copy Link",
      copyText: "Copy Text",
      copiedLink: "Link Copied!",
      copiedText: "Text Copied!",
      tryAnother: "Try Another Pair",
      shareTemplate: ({ nameA, nameB, score, badge, url }) =>
        `💘 Love Calculator\n${nameA} + ${nameB} = ${score}% (${badge})\nTry yours at: ${url}`,
    },
    history: {
      title: "Recent Matches",
      subtitle: "Stored locally on your device (up to 10 results)",
      clearAll: "Clear All",
      empty: "No match history yet. Calculate your first pair above!",
      loadAria: "Load this match result",
      removeAria: "Remove history item",
    },
    disclaimer:
      "Note: Created purely for entertainment. Names are never sent to or stored on any server.",
  },
};
