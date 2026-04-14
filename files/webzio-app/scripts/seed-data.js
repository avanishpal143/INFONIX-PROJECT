const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite';

async function seedData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // ==================== CATEGORIES ====================
    console.log('📁 Creating Categories...\n');
    
    const categories = [
      {
        name: 'Food & Dining',
        slug: 'food-dining',
        description: 'Restaurants, cafes, bakeries, and food delivery services',
        icon: '🍽️',
        color: '#F59E0B',
        isActive: true,
        templateCount: 0,
        createdAt: new Date()
      },
      {
        name: 'Hotels & Stays',
        slug: 'hotels-stays',
        description: 'Hotels, resorts, guest houses, and accommodation services',
        icon: '🏨',
        color: '#3B82F6',
        isActive: true,
        templateCount: 0,
        createdAt: new Date()
      },
      {
        name: 'Business',
        slug: 'business',
        description: 'Corporate websites, consulting, and professional services',
        icon: '💼',
        color: '#8B5CF6',
        isActive: true,
        templateCount: 0,
        createdAt: new Date()
      },
      {
        name: 'E-commerce',
        slug: 'e-commerce',
        description: 'Online stores, product catalogs, and shopping platforms',
        icon: '🛍️',
        color: '#22D3EE',
        isActive: true,
        templateCount: 0,
        createdAt: new Date()
      },
      {
        name: 'Personal',
        slug: 'personal',
        description: 'Personal portfolios, blogs, and individual websites',
        icon: '👤',
        color: '#EC4899',
        isActive: true,
        templateCount: 0,
        createdAt: new Date()
      },
      {
        name: 'Health & Wellness',
        slug: 'health-wellness',
        description: 'Gyms, yoga studios, spas, and wellness centers',
        icon: '💪',
        color: '#10B981',
        isActive: true,
        templateCount: 0,
        createdAt: new Date()
      }
    ];

    const categoriesCollection = db.collection('categories');
    await categoriesCollection.deleteMany({}); // Clear existing
    const categoryResult = await categoriesCollection.insertMany(categories);
    console.log(`✅ Created ${categoryResult.insertedCount} categories\n`);

    // ==================== TEMPLATES ====================
    console.log('🎨 Creating Templates...\n');
    
    const templates = [
      {
        name: 'Restaurant Elite',
        category: 'Food & Dining',
        icon: '🍴',
        desc: 'Fine dining menu with categories, photos & WhatsApp reservations',
        color: 'linear-gradient(135deg, #c2410c, #ea580c)',
        accentColor: '#ea580c',
        tags: ['Menu', 'WhatsApp', 'Booking', 'Gallery'],
        popular: true,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cafe & Bakery',
        category: 'Food & Dining',
        icon: '☕',
        desc: 'Cozy cafe template with daily specials, gallery & order button',
        color: 'linear-gradient(135deg, #92400e, #b45309)',
        accentColor: '#d97706',
        tags: ['Menu', 'Gallery', 'Orders', 'Specials'],
        popular: true,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fast Food & Takeaway',
        category: 'Food & Dining',
        icon: '🍔',
        desc: 'Bold, colorful menu for quick-service restaurants & delivery',
        color: 'linear-gradient(135deg, #dc2626, #ef4444)',
        accentColor: '#ef4444',
        tags: ['Menu', 'Delivery', 'Quick', 'Takeaway'],
        popular: true,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Luxury Hotel',
        category: 'Hotels & Stays',
        icon: '🏨',
        desc: 'Elegant hotel template with room showcase & booking system',
        color: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
        accentColor: '#3b82f6',
        tags: ['Rooms', 'Booking', 'Gallery', 'Amenities'],
        popular: true,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Beach Resort',
        category: 'Hotels & Stays',
        icon: '🏖️',
        desc: 'Tropical resort template with activities & vacation packages',
        color: 'linear-gradient(135deg, #0891b2, #06b6d4)',
        accentColor: '#06b6d4',
        tags: ['Resort', 'Packages', 'Activities', 'Beach'],
        popular: false,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Business Portfolio',
        category: 'Business',
        icon: '🚀',
        desc: 'Professional portfolio template for showcasing projects',
        color: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
        accentColor: '#8b5cf6',
        tags: ['Portfolio', 'Projects', 'Business', 'Professional'],
        popular: true,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'portfolio',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Corporate Website',
        category: 'Business',
        icon: '💼',
        desc: 'Modern corporate template with services & team showcase',
        color: 'linear-gradient(135deg, #1e40af, #3b82f6)',
        accentColor: '#3b82f6',
        tags: ['Corporate', 'Services', 'Team', 'About'],
        popular: false,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Online Store',
        category: 'E-commerce',
        icon: '🛍️',
        desc: 'Modern e-commerce template with product catalog & cart',
        color: 'linear-gradient(135deg, #0891b2, #22d3ee)',
        accentColor: '#22d3ee',
        tags: ['Products', 'Shop', 'Cart', 'Checkout'],
        popular: true,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fashion Boutique',
        category: 'E-commerce',
        icon: '👗',
        desc: 'Stylish boutique template with collections & lookbook',
        color: 'linear-gradient(135deg, #db2777, #ec4899)',
        accentColor: '#ec4899',
        tags: ['Fashion', 'Collections', 'Lookbook', 'Style'],
        popular: false,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Personal Portfolio',
        category: 'Personal',
        icon: '👤',
        desc: 'Creative portfolio for designers, developers & artists',
        color: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        accentColor: '#a855f7',
        tags: ['Portfolio', 'Creative', 'Projects', 'About'],
        popular: true,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'portfolio',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fitness Studio',
        category: 'Health & Wellness',
        icon: '💪',
        desc: 'Dynamic gym template with classes, trainers & membership',
        color: 'linear-gradient(135deg, #059669, #10b981)',
        accentColor: '#10b981',
        tags: ['Fitness', 'Classes', 'Trainers', 'Membership'],
        popular: false,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Yoga & Wellness',
        category: 'Health & Wellness',
        icon: '🧘',
        desc: 'Peaceful yoga studio template with schedules & workshops',
        color: 'linear-gradient(135deg, #0d9488, #14b8a6)',
        accentColor: '#14b8a6',
        tags: ['Yoga', 'Wellness', 'Classes', 'Meditation'],
        popular: false,
        isActive: true,
        previewImage: '',
        files: [],
        usageCount: 0,
        templateType: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const templatesCollection = db.collection('templates');
    await templatesCollection.deleteMany({}); // Clear existing
    const templateResult = await templatesCollection.insertMany(templates);
    console.log(`✅ Created ${templateResult.insertedCount} templates\n`);

    // ==================== PORTFOLIO ITEMS ====================
    console.log('🖼️ Creating Portfolio Items...\n');
    
    const portfolioItems = [
      {
        title: 'Modern Restaurant Website',
        description: 'A beautiful restaurant website with online menu and reservation system',
        category: 'Food & Dining',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        url: 'https://example.com/restaurant',
        tags: ['Restaurant', 'Menu', 'Booking'],
        featured: true,
        isActive: true,
        order: 1,
        createdAt: new Date()
      },
      {
        title: 'Luxury Hotel Booking Platform',
        description: 'Elegant hotel website with room showcase and online booking',
        category: 'Hotels & Stays',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        url: 'https://example.com/hotel',
        tags: ['Hotel', 'Booking', 'Luxury'],
        featured: true,
        isActive: true,
        order: 2,
        createdAt: new Date()
      },
      {
        title: 'E-commerce Fashion Store',
        description: 'Modern online store with product catalog and shopping cart',
        category: 'E-commerce',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        url: 'https://example.com/fashion',
        tags: ['E-commerce', 'Fashion', 'Shopping'],
        featured: true,
        isActive: true,
        order: 3,
        createdAt: new Date()
      },
      {
        title: 'Corporate Business Website',
        description: 'Professional corporate website with services and team showcase',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        url: 'https://example.com/corporate',
        tags: ['Business', 'Corporate', 'Professional'],
        featured: false,
        isActive: true,
        order: 4,
        createdAt: new Date()
      },
      {
        title: 'Fitness Studio Platform',
        description: 'Dynamic fitness website with class schedules and trainer profiles',
        category: 'Health & Wellness',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
        url: 'https://example.com/fitness',
        tags: ['Fitness', 'Gym', 'Health'],
        featured: false,
        isActive: true,
        order: 5,
        createdAt: new Date()
      },
      {
        title: 'Creative Portfolio',
        description: 'Stunning portfolio website for designers and artists',
        category: 'Personal',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
        url: 'https://example.com/portfolio',
        tags: ['Portfolio', 'Creative', 'Design'],
        featured: true,
        isActive: true,
        order: 6,
        createdAt: new Date()
      }
    ];

    const portfolioCollection = db.collection('portfolios');
    await portfolioCollection.deleteMany({}); // Clear existing
    const portfolioResult = await portfolioCollection.insertMany(portfolioItems);
    console.log(`✅ Created ${portfolioResult.insertedCount} portfolio items\n`);

    // ==================== SUMMARY ====================
    console.log('📊 Database Seeding Complete!\n');
    console.log('=' .repeat(50));
    console.log(`✅ Categories: ${categoryResult.insertedCount}`);
    console.log(`✅ Templates: ${templateResult.insertedCount}`);
    console.log(`✅ Portfolio Items: ${portfolioResult.insertedCount}`);
    console.log('=' .repeat(50));
    console.log('\n🎉 All sample data created successfully!\n');
    console.log('📋 You can now view them in the admin panel:');
    console.log('   - Categories: http://localhost:3002/admin/categories');
    console.log('   - Templates: http://localhost:3002/admin/templates');
    console.log('   - Portfolio: http://localhost:3002/admin/portfolio\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedData();
