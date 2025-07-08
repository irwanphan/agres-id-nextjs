const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importPickupPoints() {
  try {
    console.log('🚀 Starting pickup points import...');
    
    // Read CSV file
    const csvPath = path.join(__dirname, '../seed-production-data/agrespp.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV content
    const lines = csvContent.split('\n');
    const headers = lines[0].split(';').map(header => header.trim().replace(/\r$/, ''));
    
    console.log('📋 Headers found:', headers);
    
    // Process each line (skip header)
    const pickupPoints = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(';').map(value => value.trim().replace(/\r$/, ''));
      if (values.length < headers.length) {
        console.warn(`⚠️  Skipping line ${i + 1}: insufficient columns`);
        continue;
      }
      
      // Map CSV columns to database fields
      const pickupPoint = {
        name: values[0]?.trim() || '',
        address: values[1]?.trim() || '',
        province: values[2]?.trim() || '',
        city: values[3]?.trim() || '',
        phone: values[5]?.trim() || null,
        latitude: values[6] ? parseFloat(values[6]) : null,
        longitude: values[7] ? parseFloat(values[7]) : null,
        teamCode: values[8]?.trim() || null,
        isActive: true
      };
      
      // Validate required fields
      if (!pickupPoint.name || !pickupPoint.address || !pickupPoint.province || !pickupPoint.city) {
        console.warn(`⚠️  Skipping line ${i + 1}: missing required fields`);
        continue;
      }
      
      pickupPoints.push(pickupPoint);
    }
    
    console.log(`📊 Found ${pickupPoints.length} valid pickup points to import`);
    
    // Clear existing pickup points (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing pickup points...');
    await prisma.pickupPoint.deleteMany({});
    
    // Import pickup points
    console.log('📥 Importing pickup points...');
    const results = await prisma.pickupPoint.createMany({
      data: pickupPoints,
      skipDuplicates: true
    });
    
    console.log(`✅ Successfully imported ${results.count} pickup points`);
    
    // Verify import
    const totalCount = await prisma.pickupPoint.count();
    console.log(`📈 Total pickup points in database: ${totalCount}`);
    
    // Show sample of imported data
    const sample = await prisma.pickupPoint.findMany({
      take: 5,
      select: {
        name: true,
        city: true,
        province: true,
        teamCode: true
      }
    });
    
    console.log('📋 Sample of imported pickup points:');
    sample.forEach((point, index) => {
      console.log(`  ${index + 1}. ${point.name} - ${point.city}, ${point.province} (${point.teamCode})`);
    });
    
  } catch (error) {
    console.error('❌ Error importing pickup points:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
if (require.main === module) {
  importPickupPoints()
    .then(() => {
      console.log('🎉 Import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Import failed:', error);
      process.exit(1);
    });
}

module.exports = { importPickupPoints }; 