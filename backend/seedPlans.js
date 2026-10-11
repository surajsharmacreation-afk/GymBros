const mongoose = require('mongoose');
const Plan = require('./models/Plan');
require('dotenv').config();

const defaultPlans = [
  {
    name: 'Basic Starter',
    durationMonths: 1,
    price: 1200,
    features: ['General Gym Floor Access', 'Locker Facility', 'Locker Room'],
    isActive: true
  },
  {
    name: 'Pro Quarterly',
    durationMonths: 3,
    price: 3200,
    features: ['All Starter Features', 'Cardio + Strength Area', 'Diet Consultation (1x)'],
    isActive: true
  },
  {
    name: 'Elite Annual',
    durationMonths: 12,
    price: 10500,
    features: ['Full Gym Access 24/7', 'Personal Trainer Support', 'Custom Diet & Workout Chart'],
    isActive: true
  }
];

async function seedPlans() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Plan.deleteMany({});
    await Plan.insertMany(defaultPlans);
    console.log('✅ Gym Plans seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding plans:', err);
    process.exit(1);
  }
}

seedPlans();