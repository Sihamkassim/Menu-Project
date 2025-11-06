import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/Model/User';
import MenuItem from './src/Model/Menu';

dotenv.config();

const sampleMenuItems = [
  {
    name: 'Caesar Salad',
    category: 'Appetizers',
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    price: 12.99,
    availability: true,
  },
  {
    name: 'Bruschetta',
    category: 'Appetizers',
    description: 'Grilled bread topped with fresh tomatoes, garlic, and basil',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
    price: 9.99,
    availability: true,
  },
  {
    name: 'Margherita Pizza',
    category: 'Main Course',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    price: 15.99,
    availability: true,
  },
  {
    name: 'Spaghetti Carbonara',
    category: 'Main Course',
    description: 'Pasta with creamy egg sauce, pancetta, and parmesan',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    price: 17.99,
    availability: true,
  },
  {
    name: 'Grilled Salmon',
    category: 'Main Course',
    description: 'Fresh Atlantic salmon with lemon butter sauce and vegetables',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    price: 24.99,
    availability: true,
  },
  {
    name: 'Beef Burger',
    category: 'Main Course',
    description: 'Juicy beef patty with lettuce, tomato, cheese, and special sauce',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    price: 13.99,
    availability: true,
  },
  {
    name: 'Tiramisu',
    category: 'Desserts',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    price: 8.99,
    availability: true,
  },
  {
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    price: 9.99,
    availability: true,
  },
  {
    name: 'Freshly Squeezed Orange Juice',
    category: 'Beverages',
    description: '100% fresh orange juice',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    price: 5.99,
    availability: true,
  },
  {
    name: 'Iced Coffee',
    category: 'Beverages',
    description: 'Cold brew coffee served over ice',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
    price: 4.99,
    availability: true,
  },
  {
    name: 'Greek Salad',
    category: 'Salads',
    description: 'Fresh vegetables with feta cheese, olives, and olive oil',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    price: 11.99,
    availability: true,
  },
  {
    name: 'Tomato Soup',
    category: 'Soups',
    description: 'Creamy tomato soup with fresh herbs and cream',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    price: 7.99,
    availability: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || '';
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user with explicit salt rounds
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('🔐 Password hashed successfully');
    
    const admin = await User.create({
      username: 'admin',
      email: 'admin@restaurant.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('👤 Created admin user');
    console.log('   Email: admin@restaurant.com');
    console.log('   Password: admin123');
    console.log('   User ID:', admin._id);

    // Create menu items
    const menuItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`🍽️  Created ${menuItems.length} menu items`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Quick Start:');
    console.log('1. Start backend: npm run dev');
    console.log('2. Start frontend: cd ../client && npm run dev');
    console.log('3. Login at: http://localhost:5173/admin/login');
    console.log('   Email: admin@restaurant.com');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
