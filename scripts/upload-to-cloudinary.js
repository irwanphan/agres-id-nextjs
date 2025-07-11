const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const dir = path.join(__dirname, '../assets-to-migrate/assets/images/product');
const batchSize = 100; // jumlah file per batch
const uploadedLog = path.join(__dirname, '../assets-to-migrate/uploaded-to-cloudinary.json');

// Load file yang sudah di-upload
let uploaded = [];
if (fs.existsSync(uploadedLog)) {
  uploaded = JSON.parse(fs.readFileSync(uploadedLog));
}

// Ambil semua file yang belum di-upload
const allFiles = fs.readdirSync(dir);
const filesToUpload = allFiles.filter(f => !uploaded.includes(f));

async function uploadBatch(batch) {
  await Promise.all(batch.map(async (file) => {
    const filePath = path.join(dir, file);
    try {
      await cloudinary.uploader.upload(filePath, {
        folder: 'products',
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
      uploaded.push(file);
      console.log(`Uploaded: ${file}`);
    } catch (err) {
      console.error(`Failed: ${file}`, err.message);
    }
  }));
  // Simpan progress setiap selesai batch
  fs.writeFileSync(uploadedLog, JSON.stringify(uploaded, null, 2));
}

async function main() {
  for (let i = 0; i < filesToUpload.length; i += batchSize) {
    const batch = filesToUpload.slice(i, i + batchSize);
    console.log(`Uploading batch ${i / batchSize + 1} (${batch.length} files)...`);
    await uploadBatch(batch);
  }
  console.log('All done!');
}

main();
