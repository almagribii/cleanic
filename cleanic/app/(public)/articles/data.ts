export type ArticleItem = {
  id: number;
  title: string;
  description: string;
  content: string;
  image_path: string;
  created_at: string;
};

export const articles: ArticleItem[] = [
  {
    id: 1,
    title: "Mengenal Sampah Organik dan Anorganik dari Rumah",
    description:
      "Panduan dasar memilah sampah rumah tangga agar proses daur ulang dan pengolahan jadi lebih efektif.",
    image_path: "/article/art_1.jpeg",
    created_at: "2026-04-11T08:00:00.000Z",
    content: `## Kenapa perlu memilah dari rumah?

Sebagian besar sampah kota berasal dari aktivitas rumah tangga. Jika semua jenis sampah dicampur, proses daur ulang menjadi sulit dan biaya pengolahan meningkat.

## Klasifikasi dasar sampah

1. **Sampah organik**: sisa makanan, daun, kulit buah.
2. **Sampah anorganik**: plastik, kaca, logam, kertas.

## Praktik sederhana yang bisa langsung dilakukan

- Sediakan minimal dua wadah: organik dan anorganik.
- Tiriskan sisa makanan sebelum dibuang agar tidak mencemari sampah lain.
- Cuci ringan kemasan plastik dan kaleng sebelum dimasukkan ke wadah anorganik.

> Pemilahan sederhana di rumah adalah langkah pertama menuju lingkungan yang lebih bersih.
`,
  },
  {
    id: 2,
    title: "Sampah B3 Rumah Tangga: Kenali dan Pisahkan dengan Aman",
    description:
      "Edukasi tentang sampah berbahaya seperti baterai, lampu, dan obat kedaluwarsa agar tidak mencemari tanah dan air.",
    image_path: "/article/art_2.jpeg",
    created_at: "2026-04-12T09:30:00.000Z",
    content: `## Apa itu sampah B3?

Sampah B3 adalah limbah bahan berbahaya dan beracun. Dalam skala rumah tangga, jenis ini sering tidak disadari keberadaannya.

## Contoh sampah B3 di rumah

- Baterai bekas dan aki kecil.
- Lampu neon atau lampu hemat energi.
- Obat kedaluwarsa dan kemasan pestisida.

## Cara penanganan awal

1. Simpan terpisah dalam wadah tertutup.
2. Jangan dibakar atau dicampur dengan sampah dapur.
3. Serahkan ke bank sampah atau titik kumpul limbah B3 setempat.

Pemilahan B3 melindungi kesehatan keluarga sekaligus mencegah pencemaran lingkungan.
`,
  },
  {
    id: 3,
    title: "Sampah Residu Itu Apa? Ini Bedanya dengan Sampah Daur Ulang",
    description:
      "Penjelasan praktis mengenai residu dan kenapa pemahaman kategori ini penting dalam sistem persampahan kota.",
    image_path: "/article/art_3.jpeg",
    created_at: "2026-04-14T14:15:00.000Z",
    content: `## Pengertian sampah residu

Sampah residu adalah sampah yang sulit didaur ulang atau tidak bisa diolah secara biologis. Contohnya popok sekali pakai, puntung rokok, dan kemasan multilayer tertentu.

## Perbedaan utama kategori sampah

- **Daur ulang**: masih memiliki nilai bahan, seperti botol kaca dan kardus.
- **Organik**: bisa dikomposkan.
- **Residu**: minim potensi olah ulang, biasanya menuju tempat pemrosesan akhir.

## Kenapa harus dipisahkan?

1. Mengurangi volume sampah yang langsung ke TPA.
2. Meningkatkan kualitas material daur ulang.
3. Membantu petugas kebersihan bekerja lebih aman dan efisien.

Semakin sedikit residu, semakin baik kualitas pengelolaan sampah kota.
`,
  },
  {
    id: 4,
    title: "Kompos di Rumah: Solusi Mudah untuk Sampah Organik",
    description:
      "Langkah sederhana membuat kompos dari sisa dapur untuk mengurangi timbunan sampah organik harian.",
    image_path: "/article/art_4.jpeg",
    created_at: "2026-04-16T11:45:00.000Z",
    content: `## Potensi sampah organik

Sisa makanan dan daun kering adalah jenis sampah yang paling cepat menumpuk di rumah. Padahal, bahan ini bisa diolah menjadi kompos bernilai guna.

## Bahan yang bisa dikomposkan

- Kulit buah dan sayur.
- Ampas kopi atau teh.
- Daun kering dan potongan rumput.

## Bahan yang sebaiknya dihindari

1. Minyak dan makanan berlemak.
2. Tulang dalam jumlah besar.
3. Plastik atau logam.

Kompos membantu mengurangi bau sampah dan memperbaiki kualitas tanah tanaman di rumah.
`,
  },
  {
    id: 5,
    title: "Bank Sampah: Cara Kerja dan Manfaat untuk Warga",
    description:
      "Kenali sistem bank sampah sebagai sarana edukasi, pengumpulan material daur ulang, dan peningkatan ekonomi komunitas.",
    image_path: "/article/art_5.jpeg",
    created_at: "2026-04-18T10:20:00.000Z",
    content: `## Apa itu bank sampah?

Bank sampah adalah sistem pengelolaan di mana warga menyetor sampah terpilah, lalu nilainya dicatat seperti tabungan.

## Jenis sampah yang umum diterima

- Plastik PET dan HDPE.
- Kertas, kardus, dan koran.
- Logam ringan dan kaca tertentu.

## Manfaat bank sampah

1. Mendorong kebiasaan memilah sejak rumah.
2. Mengurangi beban sampah ke TPA.
3. Memberi nilai ekonomi bagi warga dan kelompok pengelola.

Bank sampah efektif jika warga konsisten menyetor sampah dalam kondisi bersih dan terpisah.
`,
  },
  {
    id: 6,
    title: "Plastik Sekali Pakai: Dampak dan Alternatif Ramah Lingkungan",
    description:
      "Ulasan singkat dampak plastik sekali pakai serta pilihan pengganti yang lebih berkelanjutan dalam aktivitas harian.",
    image_path: "/article/art_6.jpeg",
    created_at: "2026-04-20T13:10:00.000Z",
    content: `## Mengapa plastik sekali pakai bermasalah?

Plastik jenis ini dipakai sebentar, tetapi terurai sangat lama. Jika tidak dikelola, limbahnya dapat menyumbat saluran air dan mencemari laut.

## Contoh yang sering dipakai

- Kantong plastik tipis.
- Sedotan dan alat makan sekali pakai.
- Gelas dan kemasan makanan berbahan campuran.

## Alternatif yang lebih baik

1. Gunakan tas belanja pakai ulang.
2. Bawa botol minum dan wadah makan sendiri.
3. Pilih produk isi ulang atau kemasan besar.

Pengurangan plastik sekali pakai lebih efektif jika dilakukan konsisten oleh individu dan komunitas.
`,
  },
  {
    id: 7,
    title: "Pilah Sampah di Sekolah: Model Edukasi Lingkungan untuk Siswa",
    description:
      "Strategi membangun kebiasaan memilah sampah di lingkungan sekolah melalui aturan sederhana dan praktik rutin.",
    image_path: "/article/art_7.jpeg",
    created_at: "2026-04-22T09:00:00.000Z",
    content: `## Sekolah sebagai ruang pembiasaan

Kebiasaan memilah sampah lebih mudah terbentuk jika dimulai di sekolah sejak usia dini. Siswa belajar tanggung jawab melalui praktik langsung.

## Komponen program sederhana

- Tempat sampah berlabel jelas: organik, anorganik, residu.
- Jadwal piket kebersihan kelas.
- Kegiatan pekanan evaluasi volume sampah.

## Indikator keberhasilan

1. Siswa mampu menyebutkan klasifikasi sampah dengan benar.
2. Sampah daur ulang lebih bersih dan tidak tercampur.
3. Lingkungan sekolah lebih rapi dan minim bau.

Program kecil yang konsisten dapat membentuk perilaku ramah lingkungan jangka panjang.
`,
  },
  {
    id: 8,
    title: "Dari Rumah ke Kota: Dampak Positif Klasifikasi Sampah yang Benar",
    description:
      "Penutup edukatif tentang hubungan kebiasaan memilah sampah di rumah dengan kualitas lingkungan kota secara keseluruhan.",
    image_path: "/article/art_8.jpeg",
    created_at: "2026-04-24T15:40:00.000Z",
    content: `## Dampak berantai dari pemilahan sampah

Klasifikasi sampah yang benar di tingkat rumah tangga memberi efek besar pada sistem pengelolaan kota.

## Manfaat di tingkat kota

- Armada pengangkutan lebih efisien karena jenis sampah lebih jelas.
- Fasilitas daur ulang menerima material yang lebih berkualitas.
- Tempat pemrosesan akhir tidak cepat penuh.

## Langkah yang bisa dimulai hari ini

1. Kenali tiga kategori utama: organik, anorganik, residu.
2. Biasakan cuci dan keringkan sampah daur ulang.
3. Ikut program bank sampah di lingkungan sekitar.

Perubahan lingkungan dimulai dari kebiasaan kecil yang dilakukan terus menerus.
`,
  },
];

export const getArticleById = (id: number) =>
  articles.find((article) => article.id === id);
