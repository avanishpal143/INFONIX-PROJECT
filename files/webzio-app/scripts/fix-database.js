const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite';

async function fixDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Step 1: Fix all uppercase roles
    console.log('📝 Step 1: Fixing uppercase role values...');
    
    const adminUpdate = await usersCollection.updateMany(
      { role: 'ADMIN' },
      { $set: { role: 'admin' } }
    );
    console.log(`   Fixed ${adminUpdate.modifiedCount} ADMIN → admin`);

    const superadminUpdate = await usersCollection.updateMany(
      { role: 'SUPERADMIN' },
      { $set: { role: 'superadmin' } }
    );
    console.log(`   Fixed ${superadminUpdate.modifiedCount} SUPERADMIN → superadmin`);

    const userUpdate = await usersCollection.updateMany(
      { role: 'USER' },
      { $set: { role: 'user' } }
    );
    console.log(`   Fixed ${userUpdate.modifiedCount} USER → user\n`);

    // Step 2: Fix avatar field (should be string, not object)
    console.log('📝 Step 2: Fixing avatar field...');
    const avatarUpdate = await usersCollection.updateMany(
      { avatar: { $type: 'object' } },
      { $set: { avatar: '' } }
    );
    console.log(`   Fixed ${avatarUpdate.modifiedCount} avatar fields\n`);

    // Step 3: Create/Update super admin user
    console.log('📝 Step 3: Setting up super admin user...');
    const email = 'rahulkumar9508548671@gmail.com';
    const password = 'rahul123';
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      // Update existing user
      await usersCollection.updateOne(
        { email },
        {
          $set: {
            password: hashedPassword,
            role: 'superadmin',
            isVerified: true,
            isActive: true,
            avatar: ''
          }
        }
      );
      console.log(`   ✅ Updated existing user: ${email}`);
    } else {
      // Create new user
      await usersCollection.insertOne({
        name: 'Rahul Kumar',
        email: email,
        password: hashedPassword,
        avatar: '',
        isVerified: true,
        isActive: true,
        role: 'superadmin',
        oauthProvider: '',
        oauthId: '',
        loginCount: 0,
        loginAttempts: 0,
        createdAt: new Date()
      });
      console.log(`   ✅ Created new super admin user: ${email}`);
    }

    console.log('\n🎉 Database fixed successfully!\n');
    console.log('📋 Super Admin Credentials:');
    console.log('   Email: rahulkumar9508548671@gmail.com');
    console.log('   Password: rahul123');
    console.log('   Role: superadmin\n');

    // Step 4: Verify all users
    console.log('📊 Current users in database:');
    const allUsers = await usersCollection.find({}, { 
      projection: { name: 1, email: 1, role: 1, isVerified: 1, isActive: 1 } 
    }).toArray();
    
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      console.log(`      Role: ${user.role} | Verified: ${user.isVerified} | Active: ${user.isActive}`);
    });

    console.log('\n✅ All done! You can now login at: http://localhost:3002/admin/login\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixDatabase();
