# Super Admin Panel Access Guide

## Overview
The Super Admin Panel is a powerful control center for managing the entire Infonix Cloud platform. It provides access to user management, store oversight, templates, categories, portfolio, and detailed reports.

## How to Access Super Admin Panel

### Method 1: From Dashboard (Recommended)
1. Log in to your account at `http://localhost:3002/login`
2. If your account has `admin` or `superadmin` role, you'll see a **"⚡ Super Admin"** link in the sidebar
3. Click on the Super Admin link to access the panel

### Method 2: Direct URL
- Navigate directly to: `http://localhost:3002/admin`
- You must be logged in with admin/superadmin privileges

## Setting Up Admin Users

### Option 1: Update Existing User in MongoDB
Connect to your MongoDB database and update a user's role:

```javascript
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "superadmin" } }
)
```

### Option 2: Create New Admin User via Signup
1. Sign up normally at `http://localhost:3002/signup`
2. Verify your email with the OTP sent to your Gmail
3. Update your role in MongoDB to `superadmin` or `admin`
4. Log out and log back in to see the Super Admin link

## User Roles

- **user** (default): Regular user with access to dashboard and their own stores
- **admin**: Access to admin panel with management capabilities
- **superadmin**: Full access to all admin features and system controls

## Super Admin Features

The Super Admin Panel includes:

- 📊 **Dashboard**: System-wide statistics and overview
- 👥 **Users**: Manage all user accounts, roles, and permissions
- 🏪 **Stores**: Oversee all stores across the platform
- 🎨 **Templates**: Manage website templates
- 📁 **Categories**: Organize and manage categories
- 🖼️ **Portfolio**: Showcase management
- 📈 **Reports**: Detailed analytics and reports

## Security Notes

- Admin routes are protected by middleware
- Only users with `admin` or `superadmin` role can access `/admin/*` routes
- The Super Admin link only appears in the dashboard for authorized users
- Always keep your admin credentials secure

## Troubleshooting

### "Super Admin" link not showing?
- Check your user role in MongoDB
- Log out and log back in after role change
- Clear browser cache and cookies

### Cannot access `/admin` routes?
- Ensure you're logged in
- Verify your role is set to `admin` or `superadmin`
- Check that the token cookie is set properly

## Quick Setup for Testing

```bash
# 1. Start your app
npm run dev -- -p 3002

# 2. Sign up a new user
# Visit: http://localhost:3002/signup

# 3. Check your Gmail for OTP and verify

# 4. Update role in MongoDB
# Use MongoDB Compass or CLI to set role to "superadmin"

# 5. Log out and log back in

# 6. You should now see the Super Admin link in the sidebar
```

## Email Configuration

Make sure your `.env.local` has proper email configuration:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-gmail@gmail.com
```

Note: Use Gmail App Password, not your regular password. Generate one at: https://myaccount.google.com/apppasswords
