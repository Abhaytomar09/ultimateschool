require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { seedDemoData } = require('./utils/demoSeeder');

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected. Running seeder...');
    await seedDemoData();
    console.log('Seeding complete. Exiting...');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
})();
