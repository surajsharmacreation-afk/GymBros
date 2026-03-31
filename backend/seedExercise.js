const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');
require('dotenv').config();

const exercises = [
  
  {
    name: 'Push-ups',
    description: 'Classic upper body exercise targeting chest, shoulders, and triceps. Start in plank position, lower body until chest nearly touches floor, push back up.',
    durationMinutes: 5,
    sets: 3,
    reps: 10,
    week: 1,
    day: 1,
    category: 'strength',
    difficulty: 'beginner',
    caloriesBurned: 30,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/18/27/be/1827be178c019b1dc6f8a8d211206c94.gif'
  },
  {
    name: 'Bodyweight Squats',
    description: 'Fundamental lower body exercise. Stand with feet shoulder-width apart, lower hips back and down, keep chest up, return to standing.',
    durationMinutes: 5,
    sets: 3,
    reps: 15,
    week: 1,
    day: 1,
    category: 'strength',
    difficulty: 'beginner',
    caloriesBurned: 40,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/d4/4d/14/d44d1455a6cee265022e0a4c9156bb6e.gif'
  },
  {
    name: 'Plank Hold',
    description: 'Core stability exercise. Hold body in straight line from head to heels, engage abs, maintain neutral spine.',
    durationMinutes: 3,
    sets: 3,
    reps: 1,
    week: 1,
    day: 1,
    category: 'strength',
    difficulty: 'beginner',
    caloriesBurned: 20,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/cf/96/ed/cf96ed7e23bc996f173fc1b40e30547c.gif'
  },

  // Day 2
  {
    name: 'Jumping Jacks',
    description: 'Full body cardio warmup. Jump while spreading legs and raising arms overhead, return to start position.',
    durationMinutes: 5,
    sets: 3,
    reps: 20,
    week: 1,
    day: 2,
    category: 'cardio',
    difficulty: 'beginner',
    caloriesBurned: 50,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/56/56/47/565647e5bb8c80f20bd83e54e69c8433.gif'
  },
  {
    name: 'Lunges',
    description: 'Single-leg strength exercise. Step forward, lower back knee toward ground, push back to start. Alternate legs.',
    durationMinutes: 5,
    sets: 3,
    reps: 10,
    week: 1,
    day: 2,
    category: 'strength',
    difficulty: 'beginner',
    caloriesBurned: 35,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/d9/ce/7c/d9ce7c8f6c9e8e8f8f8f8f8f8f8f8f8f.gif'
  },
  {
    name: 'Mountain Climbers',
    description: 'Dynamic core and cardio exercise. From plank position, drive knees toward chest alternately at rapid pace.',
    durationMinutes: 4,
    sets: 3,
    reps: 15,
    week: 1,
    day: 2,
    category: 'cardio',
    difficulty: 'beginner',
    caloriesBurned: 45,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/a5/23/37/a52337d4c5f8f8f8f8f8f8f8f8f8f8f8.gif'
  },

  // Day 3 - PREMIUM
  {
    name: 'Burpees',
    description: 'High-intensity full body exercise. Squat, jump back to plank, do push-up, jump feet forward, explosive jump up.',
    durationMinutes: 6,
    sets: 3,
    reps: 10,
    week: 1,
    day: 3,
    category: 'cardio',
    difficulty: 'intermediate',
    caloriesBurned: 100,
    isPremium: true,
    gifUrl: 'https://i.pinimg.com/originals/9f/13/00/9f1300c5e5e5e5e5e5e5e5e5e5e5e5e5.gif'
  },
  {
    name: 'Diamond Push-ups',
    description: 'Advanced push-up variation targeting triceps. Form diamond shape with hands, perform push-up with elbows close to body.',
    durationMinutes: 4,
    sets: 3,
    reps: 8,
    week: 1,
    day: 3,
    category: 'strength',
    difficulty: 'intermediate',
    caloriesBurned: 40,
    isPremium: true,
    gifUrl: 'https://i.pinimg.com/originals/3a/3a/3a/3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a.gif'
  },

  // ========== WEEK 2 - INTERMEDIATE ==========
  // Day 1
  {
    name: 'Spider-Man Push-ups',
    description: 'Advanced push-up with core rotation. As you lower, bring knee to elbow. Builds obliques and chest.',
    durationMinutes: 5,
    sets: 3,
    reps: 8,
    week: 2,
    day: 1,
    category: 'strength',
    difficulty: 'intermediate',
    caloriesBurned: 50,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/b2/b2/b2/b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2.gif'
  },
  {
    name: 'Bulgarian Split Squats',
    description: 'Single-leg squat variation. Rear foot elevated on bench, lower until front thigh parallel to ground.',
    durationMinutes: 6,
    sets: 3,
    reps: 10,
    week: 2,
    day: 1,
    category: 'strength',
    difficulty: 'intermediate',
    caloriesBurned: 60,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/c1/c1/c1/c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1.gif'
  },

  // Day 2
  {
    name: 'High Knees',
    description: 'Cardio exercise. Run in place bringing knees up to waist level. Maintain quick pace.',
    durationMinutes: 4,
    sets: 3,
    reps: 20,
    week: 2,
    day: 2,
    category: 'cardio',
    difficulty: 'intermediate',
    caloriesBurned: 70,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/d3/d3/d3/d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3.gif'
  },
  {
    name: 'Bicycle Crunches',
    description: 'Ab exercise targeting obliques. Lie on back, alternate bringing elbow to opposite knee in cycling motion.',
    durationMinutes: 4,
    sets: 3,
    reps: 20,
    week: 2,
    day: 2,
    category: 'strength',
    difficulty: 'beginner',
    caloriesBurned: 30,
    isPremium: false,
    gifUrl: 'https://i.pinimg.com/originals/e4/e4/e4/e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4.gif'
  },

  // Day 3 - PREMIUM
  {
    name: 'Pull-ups',
    description: 'Upper body pulling exercise. Hang from bar, pull body up until chin over bar, lower with control.',
    durationMinutes: 5,
    sets: 3,
    reps: 8,
    week: 2,
    day: 3,
    category: 'strength',
    difficulty: 'advanced',
    caloriesBurned: 80,
    isPremium: true,
    gifUrl: 'https://i.pinimg.com/originals/f5/f5/f5/f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5.gif'
  },
  {
    name: 'Pistol Squats',
    description: 'Advanced single-leg squat. Lower on one leg while extending other leg forward. Requires balance and strength.',
    durationMinutes: 6,
    sets: 3,
    reps: 5,
    week: 2,
    day: 3,
    category: 'strength',
    difficulty: 'advanced',
    caloriesBurned: 90,
    isPremium: true,
    gifUrl: 'https://i.pinimg.com/originals/g6/g6/g6/g6g6g6g6g6g6g6g6g6g6g6g6g6g6g6g6.gif'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    
    await Exercise.deleteMany({});
    console.log('🗑️  Cleared old exercises');
    
    const result = await Exercise.insertMany(exercises);
    console.log(`✅ Added ${result.length} exercises`);
    
    
    console.log('\n📊 Exercise Summary:');
    console.log(`   Week 1: ${exercises.filter(e => e.week === 1).length} exercises`);
    console.log(`   Week 2: ${exercises.filter(e => e.week === 2).length} exercises`);
    console.log(`   Free: ${exercises.filter(e => !e.isPremium).length} exercises`);
    console.log(`   Premium: ${exercises.filter(e => e.isPremium).length} exercises`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedDatabase();