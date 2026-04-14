const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite';

async function createAllData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // ==================== CATEGORIES ====================
    console.log('📁 Creating Categories...\n');
    
    const categories = [
      { name: 'Food & Dining', slug: 'food-dining', description: 'Restaurants, cafes, bakeries, and food delivery services', icon: '🍽️', color: '#F59E0B', isActive: true, templateCount: 0, createdAt: new Date() },
      { name: 'Hotels & Stays', slug: 'hotels-stays', description: 'Hotels, resorts, guest houses, and accommodation services', icon: '🏨', color: '#3B82F6', isActive: true, templateCount: 0, createdAt: new Date() },
      { name: 'Business', slug: 'business', description: 'Corporate websites, consulting, and professional services', icon: '💼', color: '#8B5CF6', isActive: true, templateCount: 0, createdAt: new Date() },
      { name: 'E-commerce', slug: 'e-commerce', description: 'Online stores, product catalogs, and shopping platforms', icon: '🛍️', color: '#22D3EE', isActive: true, templateCount: 0, createdAt: new Date() },
      { name: 'Personal', slug: 'personal', description: 'Personal portfolios, blogs, and individual websites', icon: '👤', color: '#EC4899', isActive: true, templateCount: 0, createdAt: new Date() },
      { name: 'Health & Wellness', slug: 'health-wellness', description: 'Gyms, yoga studios, spas, and wellness centers', icon: '💪', color: '#10B981', isActive: true, templateCount: 0, createdAt: new Date() },
    ];

    const categoriesCollection = db.collection('categories');
    await categoriesCollection.deleteMany({});
    await categoriesCollection.insertMany(categories);
    console.log(`✅ Created ${categories.length} categories\n`);

    // ==================== TEMPLATES (15 templates) ====================
    console.log('🎨 Creating 15 Templates...\n');
    
    const templates = [
      // Food & Dining (5 templates)
      { name: 'Restaurant Elite', category: 'Food & Dining', icon: '🍴', desc: 'Fine dining menu with categories, photos & WhatsApp reservations', color: 'linear-gradient(135deg, #c2410c, #ea580c)', accentColor: '#ea580c', tags: ['Menu', 'WhatsApp', 'Booking', 'Gallery'], popular: true, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cafe & Bakery', category: 'Food & Dining', icon: '☕', desc: 'Cozy cafe template with daily specials, gallery & order button', color: 'linear-gradient(135deg, #92400e, #b45309)', accentColor: '#d97706', tags: ['Menu', 'Gallery', 'Orders', 'Specials'], popular: true, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fast Food & Takeaway', category: 'Food & Dining', icon: '🍔', desc: 'Bold, colorful menu for quick-service restaurants & delivery', color: 'linear-gradient(135deg, #dc2626, #ef4444)', accentColor: '#ef4444', tags: ['Menu', 'Delivery', 'Quick', 'Takeaway'], popular: true, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pizza & Italian', category: 'Food & Dining', icon: '🍕', desc: 'Italian restaurant template with menu, gallery & online ordering', color: 'linear-gradient(135deg, #b91c1c, #dc2626)', accentColor: '#dc2626', tags: ['Pizza', 'Italian', 'Menu', 'Delivery'], popular: false, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sushi & Asian Cuisine', category: 'Food & Dining', icon: '🍱', desc: 'Asian restaurant template with menu categories & reservations', color: 'linear-gradient(135deg, #7c2d12, #9a3412)', accentColor: '#9a3412', tags: ['Sushi', 'Asian', 'Menu', 'Booking'], popular: false, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      
      // Hotels & Stays (3 templates)
      { name: 'Luxury Hotel', category: 'Hotels & Stays', icon: '🏨', desc: 'Elegant hotel template with room showcase & booking system', color: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', accentColor: '#3b82f6', tags: ['Rooms', 'Booking', 'Gallery', 'Amenities'], popular: true, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Beach Resort', category: 'Hotels & Stays', icon: '🏖️', desc: 'Tropical resort template with activities & vacation packages', color: 'linear-gradient(135deg, #0891b2, #06b6d4)', accentColor: '#06b6d4', tags: ['Resort', 'Packages', 'Activities', 'Beach'], popular: false, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Boutique Hotel', category: 'Hotels & Stays', icon: '🏩', desc: 'Charming boutique hotel with unique rooms & local experiences', color: 'linear-gradient(135deg, #4c1d95, #6d28d9)', accentColor: '#6d28d9', tags: ['Boutique', 'Rooms', 'Experience', 'Local'], popular: false, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      
      // Business (2 templates)
      { name: 'Business Portfolio', category: 'Business', icon: '🚀', desc: 'Professional portfolio template for showcasing projects', color: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', accentColor: '#8b5cf6', tags: ['Portfolio', 'Projects', 'Business', 'Professional'], popular: true, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'portfolio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Corporate Website', category: 'Business', icon: '💼', desc: 'Modern corporate template with services & team showcase', color: 'linear-gradient(135deg, #1e40af, #3b82f6)', accentColor: '#3b82f6', tags: ['Corporate', 'Services', 'Team', 'About'], popular: false, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      
      // E-commerce (2 templates)
      { name: 'Online Store', category: 'E-commerce', icon: '🛍️', desc: 'Modern e-commerce template with product catalog & cart', color: 'linear-gradient(135deg, #0891b2, #22d3ee)', accentColor: '#22d3ee', tags: ['Products', 'Shop', 'Cart', 'Checkout'], popular: true, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fashion Boutique', category: 'E-commerce', icon: '👗', desc: 'Stylish boutique template with collections & lookbook', color: 'linear-gradient(135deg, #db2777, #ec4899)', accentColor: '#ec4899', tags: ['Fashion', 'Collections', 'Lookbook', 'Style'], popular: false, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      
      // Personal (1 template)
      { name: 'Personal Portfolio', category: 'Personal', icon: '👤', desc: 'Creative portfolio for designers, developers & artists', color: 'linear-gradient(135deg, #7c3aed, #a855f7)', accentColor: '#a855f7', tags: ['Portfolio', 'Creative', 'Projects', 'About'], popular: true, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'portfolio', createdAt: new Date(), updatedAt: new Date() },
      
      // Health & Wellness (2 templates)
      { name: 'Fitness Studio', category: 'Health & Wellness', icon: '💪', desc: 'Dynamic gym template with classes, trainers & membership', color: 'linear-gradient(135deg, #059669, #10b981)', accentColor: '#10b981', tags: ['Fitness', 'Classes', 'Trainers', 'Membership'], popular: false, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Yoga & Wellness', category: 'Health & Wellness', icon: '🧘', desc: 'Peaceful yoga studio template with schedules & workshops', color: 'linear-gradient(135deg, #0d9488, #14b8a6)', accentColor: '#14b8a6', tags: ['Yoga', 'Wellness', 'Classes', 'Meditation'], popular: false, isActive: true, previewImage: '', files: [], usageCount: 0, templateType: 'general', createdAt: new Date(), updatedAt: new Date() },
    ];

    const templatesCollection = db.collection('templates');
    await templatesCollection.deleteMany({});
    await templatesCollection.insertMany(templates);
    console.log(`✅ Created ${templates.length} templates\n`);

    // ==================== PORTFOLIO ITEMS ====================
    console.log('🖼️ Creating Portfolio Items...\n');
    
    const portfolioItems = [
      { title: 'Modern Restaurant Website', description: 'A beautiful restaurant website with online menu and reservation system', category: 'Food & Dining', image: '', url: '', tags: ['Restaurant', 'Menu', 'Booking'], featured: true, isActive: true, order: 1, createdAt: new Date() },
      { title: 'Luxury Hotel Booking Platform', description: 'Elegant hotel website with room showcase and online booking', category: 'Hotels & Stays', image: '', url: '', tags: ['Hotel', 'Booking', 'Luxury'], featured: true, isActive: true, order: 2, createdAt: new Date() },
      { title: 'E-commerce Fashion Store', description: 'Modern online store with product catalog and shopping cart', category: 'E-commerce', image: '', url: '', tags: ['E-commerce', 'Fashion', 'Shopping'], featured: true, isActive: true, order: 3, createdAt: new Date() },
      { title: 'Corporate Business Website', description: 'Professional corporate website with services and team showcase', category: 'Business', image: '', url: '', tags: ['Business', 'Corporate', 'Professional'], featured: false, isActive: true, order: 4, createdAt: new Date() },
      { title: 'Fitness Studio Platform', description: 'Dynamic fitness website with class schedules and trainer profiles', category: 'Health & Wellness', image: '', url: '', tags: ['Fitness', 'Gym', 'Health'], featured: false, isActive: true, order: 5, createdAt: new Date() },
      { title: 'Creative Portfolio', description: 'Stunning portfolio website for designers and artists', category: 'Personal', image: '', url: '', tags: ['Portfolio', 'Creative', 'Design'], featured: true, isActive: true, order: 6, createdAt: new Date() },
    ];

    const portfolioCollection = db.collection('portfolios');
    await portfolioCollection.deleteMany({});
    await portfolioCollection.insertMany(portfolioItems);
    console.log(`✅ Created ${portfolioItems.length} portfolio items\n`);

    // ==================== SUMMARY ====================
    console.log('=' .repeat(60));
    console.log('🎉 DATABASE POPULATED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log(`✅ Categories: ${categories.length}`);
    console.log(`✅ Templates: ${templates.length}`);
    console.log(`✅ Portfolio Items: ${portfolioItems.length}`);
    console.log('=' .repeat(60));
    console.log('\n📋 Now logout and login again to see the data!');
    console.log('   Login: http://localhost:3002/admin/login');
    console.log('   Email: rahulkumar9508548671@gmail.com');
    console.log('   Password: rahul123\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

createAllData();
