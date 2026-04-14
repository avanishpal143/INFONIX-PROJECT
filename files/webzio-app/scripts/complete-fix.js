const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite';

async function completeFix() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Fix all users with undefined or invalid roles
    console.log('📝 Fixing all user roles and fields...\n');

    // Get all users
    const allUsers = await usersCollection.find({}).toArray();

    for (const user of allUsers) {
      const updates = {};

      // Fix role
      if (!user.role || !['user', 'admin', 'superadmin'].includes(user.role)) {
        updates.role = 'user';
      }

      // Fix isVerified
      if (user.isVerified === undefined) {
        updates.isVerified = false;
      }

      // Fix isActive
      if (user.isActive === undefined) {
        updates.isActive = true;
      }

      // Fix avatar
      if (typeof user.avatar === 'object' || user.avatar === undefined) {
        updates.avatar = '';
      }

      // Fix loginCount
      if (user.loginCount === undefined) {
        updates.loginCount = 0;
      }

      // Fix loginAttempts
      if (user.loginAttempts === undefined) {
        updates.loginAttempts = 0;
      }

      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: updates }
        );
        console.log(`✅ Fixed user: ${user.email}`);
        console.log(`   Updates: ${JSON.stringify(updates)}`);
      }
    }

    // Ensure super admin user exists with correct credentials
    console.log('\n📝 Setting up super admin user...');
    const email = 'rahulkumar9508548671@gmail.com';
    const password = 'rahul123';
    const hashedPassword = await bcrypt.hash(password, 12);

    await usersCollection.updateOne(
      { email },
      {
        $set: {
          name: 'Rahul Kumar',
          password: hashedPassword,
          role: 'superadmin',
          isVerified: true,
          isActive: true,
          avatar: '',
          loginCount: 0,
          loginAttempts: 0
        }
      },
      { upsert: true }
    );

    console.log('✅ Super admin user configured\n');

    // Show final state
    console.log('📊 Final user list:');
    const finalUsers = await usersCollection.find({}, { 
      projection: { name: 1, email: 1, role: 1, isVerified: 1, isActive: 1 } 
    }).toArray();
    
    finalUsers.forEach((user, index) => {
      const status = user.role === 'superadmin' ? '👑' : user.role === 'admin' ? '⚡' : '👤';
      console.log(`   ${status} ${user.name} (${user.email})`);
      console.log(`      Role: ${user.role} | Verified: ${user.isVerified} | Active: ${user.isActive}`);
    });

    console.log('\n🎉 Database completely fixed!\n');
    console.log('📋 Super Admin Login:');
    console.log('   URL: http://localhost:3002/admin/login');
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

completeFix();
