const fs = require('fs');
const path = require('path');

function previewPickupPoints() {
  try {
    console.log('🔍 Previewing pickup points CSV data...');
    
    // Read CSV file
    const csvPath = path.join(__dirname, '../seed-production-data/agrespp.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV content
    const lines = csvContent.split('\n');
    const headers = lines[0].split(';');
    
    console.log('📋 Headers:', headers);
    console.log('📊 Total lines:', lines.length);
    
    // Analyze data
    const validRecords = [];
    const invalidRecords = [];
    const provinces = new Set();
    const cities = new Set();
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(';');
      
      // Check if we have enough columns
      if (values.length < headers.length) {
        invalidRecords.push({
          line: i + 1,
          reason: 'Insufficient columns',
          data: values
        });
        continue;
      }
      
      // Map values
      const record = {
        name: values[0]?.trim() || '',
        address: values[1]?.trim() || '',
        province: values[2]?.trim() || '',
        city: values[3]?.trim() || '',
        pinAddress: values[4]?.trim() || '',
        phone: values[5]?.trim() || '',
        latitude: values[6]?.trim() || '',
        longitude: values[7]?.trim() || '',
        teamCode: values[8]?.trim() || ''
      };
      
      // Validate required fields
      const missingFields = [];
      if (!record.name) missingFields.push('name');
      if (!record.address) missingFields.push('address');
      if (!record.province) missingFields.push('province');
      if (!record.city) missingFields.push('city');
      
      if (missingFields.length > 0) {
        invalidRecords.push({
          line: i + 1,
          reason: `Missing required fields: ${missingFields.join(', ')}`,
          data: record
        });
        continue;
      }
      
      // Validate coordinates
      if (record.latitude && isNaN(parseFloat(record.latitude))) {
        invalidRecords.push({
          line: i + 1,
          reason: 'Invalid latitude',
          data: record
        });
        continue;
      }
      
      if (record.longitude && isNaN(parseFloat(record.longitude))) {
        invalidRecords.push({
          line: i + 1,
          reason: 'Invalid longitude',
          data: record
        });
        continue;
      }
      
      validRecords.push(record);
      provinces.add(record.province);
      cities.add(record.city);
    }
    
    // Display statistics
    console.log('\n📈 Data Analysis:');
    console.log(`✅ Valid records: ${validRecords.length}`);
    console.log(`❌ Invalid records: ${invalidRecords.length}`);
    console.log(`🏛️  Unique provinces: ${provinces.size}`);
    console.log(`🏙️  Unique cities: ${cities.size}`);
    
    // Show provinces
    console.log('\n🏛️  Provinces found:');
    Array.from(provinces).sort().forEach(province => {
      console.log(`  - ${province}`);
    });
    
    // Show sample valid records
    console.log('\n📋 Sample valid records (first 5):');
    validRecords.slice(0, 5).forEach((record, index) => {
      console.log(`\n  ${index + 1}. ${record.name}`);
      console.log(`     Address: ${record.address}`);
      console.log(`     Location: ${record.city}, ${record.province}`);
      console.log(`     Phone: ${record.phone || 'N/A'}`);
      console.log(`     Team Code: ${record.teamCode || 'N/A'}`);
      console.log(`     Coordinates: ${record.latitude}, ${record.longitude}`);
    });
    
    // Show invalid records if any
    if (invalidRecords.length > 0) {
      console.log('\n❌ Invalid records:');
      invalidRecords.slice(0, 10).forEach((record, index) => {
        console.log(`\n  ${index + 1}. Line ${record.line}: ${record.reason}`);
        console.log(`     Data: ${JSON.stringify(record.data, null, 2)}`);
      });
      
      if (invalidRecords.length > 10) {
        console.log(`\n  ... and ${invalidRecords.length - 10} more invalid records`);
      }
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`Total lines processed: ${lines.length - 1}`);
    console.log(`Valid records: ${validRecords.length}`);
    console.log(`Invalid records: ${invalidRecords.length}`);
    console.log(`Success rate: ${((validRecords.length / (lines.length - 1)) * 100).toFixed(2)}%`);
    
    if (validRecords.length > 0) {
      console.log('\n✅ Data looks good for import!');
      console.log('Run: node scripts/import-pickup-points.js to import the data');
    } else {
      console.log('\n❌ No valid records found. Please check your CSV file.');
    }
    
  } catch (error) {
    console.error('❌ Error previewing data:', error);
    throw error;
  }
}

// Run the preview
if (require.main === module) {
  previewPickupPoints()
    .then(() => {
      console.log('\n🎉 Preview completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Preview failed:', error);
      process.exit(1);
    });
}

module.exports = { previewPickupPoints }; 