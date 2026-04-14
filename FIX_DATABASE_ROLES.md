# Fix Database Roles - Quick Guide

## ⚠️ Issue
Users in the database have uppercase role values (`ADMIN`, `SUPERADMIN`, `USER`) but the schema expects lowercase (`admin`, `superadmin`, `user`).

## 🔧 Quick Fix (Copy & Paste)

### Option 1: MongoDB Shell (Fastest)

```javascript
// 1. Connect to MongoDB
mongosh "mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite"

// 2. Fix all roles at once
db.users.updateMany({ role: "ADMIN" }, { $set: { role: "admin" } })
db.users.updateMany({ role: "SUPERADMIN" }, { $set: { role: "superadmin" } })
db.users.updateMany({ role: "USER" }, { $set: { role: "user" } })

// 3. Verify the fix
db.users.find({}, { email: 1, role: 1, name: 1 }).pretty()

// 4. Exit
exit
```

### Option 2: MongoDB Compass (Visual)

1. Open MongoDB Compass
2. Connect to: `mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite`
3. Click on `EcommerseWebsite` database
4. Click on `users` collection
5. Find users with uppercase roles
6. Click on each user document
7. Click "Edit Document"
8. Change `"role": "ADMIN"` to `"role": "admin"`
9. Click "Update"
10. Repeat for all users

### Option 3: Set Your User as Super Admin

```javascript
// Connect to MongoDB
mongosh "mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite"

// Replace with your email
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "superadmin" } }
)

// Verify
db.users.findOne({ email: "your-email@gmail.com" }, { email: 1, role: 1, name: 1 })

// Exit
exit
```

## ✅ After Fixing

1. Roles are now lowercase
2. Login will work correctly
3. No more validation errors
4. Admin panel accessible

## 🧪 Test Login

1. Go to: http://localhost:3002/admin/login
2. Enter your email and password
3. Click "⚡ Access Control Panel"
4. Should redirect to admin dashboard

## 📊 Expected Results

Before fix:
```json
{ "email": "user@example.com", "role": "ADMIN" }  ❌ Error
```

After fix:
```json
{ "email": "user@example.com", "role": "admin" }  ✅ Works
```

## 🎯 Valid Role Values

- `"user"` - Regular user (default)
- `"admin"` - Admin access
- `"superadmin"` - Full super admin access

**Note**: All lowercase!

## 🚀 Quick Start

Copy this command and run it:

```bash
mongosh "mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite" --eval "db.users.updateMany({ role: 'ADMIN' }, { \$set: { role: 'admin' } }); db.users.updateMany({ role: 'SUPERADMIN' }, { \$set: { role: 'superadmin' } }); db.users.updateMany({ role: 'USER' }, { \$set: { role: 'user' } }); db.users.find({}, { email: 1, role: 1 }).forEach(printjson);"
```

Done! Your database is now fixed. 🎉
