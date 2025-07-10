# Pickup Points Import Scripts

Script ini digunakan untuk mengimpor data pickup points dari file CSV ke database.

## File yang Dibutuhkan

Pastikan file CSV berada di lokasi: `seed-production-data/agrespp.csv`

## Struktur CSV yang Diharapkan

File CSV harus memiliki header dengan format berikut:
```
name;address;province;city;pinAddress;phone;latitude;longitude;teamCode
```

### Kolom yang Diperlukan:
- `name`: Nama pickup point (required)
- `address`: Alamat lengkap (required)
- `province`: Provinsi (required)
- `city`: Kota (required)
- `pinAddress`: Alamat pin (optional)
- `phone`: Nomor telepon (optional)
- `latitude`: Latitude koordinat (optional)
- `longitude`: Longitude koordinat (optional)
- `teamCode`: Kode tim (optional)

## Cara Penggunaan

### 1. Preview Data (Validasi)

Sebelum mengimpor, validasi data terlebih dahulu:

```bash
npm run preview-pickup-points
```

atau

```bash
node scripts/preview-pickup-points.js
```

Script ini akan:
- Membaca file CSV
- Memvalidasi format data
- Menampilkan statistik data
- Menunjukkan record yang bermasalah
- Menampilkan sample data yang valid

### 2. Import Data

Setelah memastikan data valid, jalankan import:

```bash
npm run import-pickup-points
```

atau

```bash
node scripts/import-pickup-points.js
```

Script ini akan:
- Membaca file CSV
- Memvalidasi setiap record
- Menghapus data pickup points yang ada (optional)
- Mengimpor data baru ke database
- Menampilkan hasil import

## Output Script

### Preview Script Output:
```
🔍 Previewing pickup points CSV data...
📋 Headers: ['name', 'address', 'province', 'city', 'pinAddress', 'phone', 'latitude', 'longitude', 'teamCode']
📊 Total lines: 174

📈 Data Analysis:
✅ Valid records: 173
❌ Invalid records: 0
🏛️  Unique provinces: 12
🏙️  Unique cities: 25

🏛️  Provinces found:
  - Banten
  - DKI Jakarta
  - DI Yogyakarta
  - Jawa Barat
  - Jawa Tengah
  - Jawa Timur
  - Kalimantan Barat
  - Kepulauan Riau
  - Sulawesi Selatan
  - Sumatera Utara

📋 Sample valid records (first 5):
  1. AGRES ID JAKARTA
     Address: JL. GUNUNG SAHARI RAYA 1  RUKO BLOK A NO. 8  ANCOL, KEC. PADEMANGAN  JAKARTA UTARA 14420
     Location: Jakarta Utara, DKI Jakarta
     Phone: 0812-9700-9800
     Team Code: JKT01-JKT11
     Coordinates: -6.135350805, 106.8313541

📊 Summary:
Total lines processed: 173
Valid records: 173
Invalid records: 0
Success rate: 100.00%

✅ Data looks good for import!
Run: node scripts/import-pickup-points.js to import the data
```

### Import Script Output:
```
🚀 Starting pickup points import...
📋 Headers found: ['name', 'address', 'province', 'city', 'pinAddress', 'phone', 'latitude', 'longitude', 'teamCode']
📊 Found 173 valid pickup points to import
🗑️  Clearing existing pickup points...
📥 Importing pickup points...
✅ Successfully imported 173 pickup points
📈 Total pickup points in database: 173

📋 Sample of imported pickup points:
  1. AGRES ID JAKARTA - Jakarta Utara, DKI Jakarta (JKT01-JKT11)
  2. AGRESKOMPUTER.COM - Jakarta Utara, DKI Jakarta (JKT05-RAK01)
  3. AGRESKOMPUTER.COM - Jakarta Pusat, DKI Jakarta (JKT05-RAK02)
  4. AGRES ID - Bandung, Jawa Barat (BDG05-RBA02)
  5. AGRES ID X INTEL - Bandung, Jawa Barat (BDG05-RBA03)

🎉 Import completed successfully!
```

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"
Pastikan Prisma client sudah di-generate:
```bash
npx prisma generate
```

### Error: "Database connection failed"
Pastikan:
1. Database berjalan
2. Environment variable `DATABASE_URL` sudah benar
3. Database schema sudah di-migrate

### Error: "File not found"
Pastikan file CSV berada di lokasi yang benar: `seed-production-data/agrespp.csv`

### Data tidak terimport
1. Jalankan preview script terlebih dahulu untuk melihat error
2. Periksa format CSV (gunakan semicolon sebagai separator)
3. Pastikan semua field required terisi

## Catatan Penting

- Script import akan **menghapus semua data pickup points yang ada** sebelum mengimpor data baru
- Jika ingin mempertahankan data existing, edit script dan comment bagian `deleteMany()`
- Pastikan backup database sebelum menjalankan import
- Script menggunakan `createMany()` untuk performa yang lebih baik
- Duplikasi akan di-skip secara otomatis berdasarkan constraint database 