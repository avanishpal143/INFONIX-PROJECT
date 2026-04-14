# Testing Guide - Infonix Cloud

## Your App is Running! 🚀

**URL**: http://localhost:3002

---

## Test 1: OTP Email Sending ✉️

### Steps:
1. Go to http://localhost:3002/signup
2. Fill in the form:
   - Full Name: `Test User`
   - Email: `your-real-email@gmail.com` (use your actual email)
   - Password: `test123` (minimum 6 characters)
3. Click "Sign Up Free"
4. **Check your Gmail inbox** - you should receive an email with:
   - Subject: "Verify Your Email - Infonix Cloud"
   - A 6-digit OTP code
   - Professional gradient styling
5. Enter the OTP on the verification page
6. You should be logged in automatically

### Expected Result:
✅ OTP email arrives in your Gmail inbox within seconds
✅ Email has professional styling with gradient header
✅ OTP is 6 digits
✅ After verification, you're logged in and redirected to dashboard

### Troubleshooting:
- Check spam folder if email doesn't arrive
- Verify EMAIL_USER and EMAIL_PASS in .env.local
- Check terminal for any email sending errors

---

## Test 2: Google OAuth Login 🔐

### Steps:
1. Go to http://localhost:3002/login
2. Click "Continue with Google" button
3. Select your Google account
4. Authorize the app
5. You should be redirected to auth-callback page (loading screen)
6. Then automatically redirected to dashboard

### Expected Result:
✅ Google authentication popup appears
✅ After authorization, redirected to auth-callback
✅ Loading screen shows "Signing you in..."
✅ Automatically redirected to dashboard
✅ User data is synced (name, email visible in sidebar)
✅ Session persists (refresh page, still logged in)

### Troubleshooting:
- If stuck on auth-callback, check browser console for errors
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
- Ensure NEXTAUTH_URL is set to http://localhost:3002

---

## Test 3: Super Admin Panel Access ⚡

### Setup (First Time Only):
You need to set a user's role to admin or superadmin in MongoDB.

#### Option A: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Find your user by email
5. Edit the document and change `role` from `"user"` to `"superadmin"`
6. Save changes

#### Option B: Using MongoDB Shell
```javascript
// Connect to your MongoDB
mongosh "mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite"

// Update user role
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "superadmin" } }
)
```

### Testing Steps:
1. **Log out** if you're currently logged in
2. **Log back in** with the account you updated
3. Go to dashboard: http://localhost:3002/dashboard
4. Look at the sidebar - you should see:
   - A divider line
   - **"⚡ Super Admin"** link (purple/gradient style)
5. Click the Super Admin link
6. You should be redirected to: http://localhost:3002/admin

### Expected Result:
✅ Super Admin link visible in dashboard sidebar (only for admin/superadmin users)
✅ Link has purple gradient styling with ⚡ icon
✅ Clicking link navigates to admin panel
✅ Admin panel loads with dark theme
✅ Can see admin navigation: Dashboard, Users, Stores, Templates, etc.
✅ Can navigate between admin sections

### For Regular Users:
❌ Super Admin link should NOT be visible
❌ Direct access to /admin should redirect to login

---

## Quick Verification Checklist

### Email System:
- [ ] OTP email arrives in Gmail
- [ ] Email has professional styling
- [ ] OTP verification works
- [ ] Resend OTP works

### Google OAuth:
- [ ] Google login button works
- [ ] Authentication flow completes
- [ ] Redirects to dashboard
- [ ] User data syncs correctly
- [ ] Session persists after refresh

### Super Admin:
- [ ] Admin link visible for admin users
- [ ] Admin link hidden for regular users
- [ ] Admin panel loads correctly
- [ ] Can navigate admin sections
- [ ] Regular users can't access /admin

---

## User Roles Explained

### 1. User (Default)
- Access to dashboard
- Can create and manage their own stores
- Can manage their own products
- No admin panel access

### 2. Admin
- All user permissions
- Access to admin panel
- Can manage other users
- Can oversee all stores
- Can manage templates and categories

### 3. Superadmin
- All admin permissions
- Full system control
- Access to all reports
- Can manage admin users

---

## Common Issues & Solutions

### Issue: OTP email not arriving
**Solution**: 
- Check spam folder
- Verify Gmail App Password is correct
- Check terminal for email errors
- Try resending OTP

### Issue: Google login fails
**Solution**:
- Check NEXTAUTH_URL matches your port (3002)
- Verify Google OAuth credentials
- Clear browser cookies
- Try incognito mode

### Issue: Super Admin link not showing
**Solution**:
- Verify role is set to "admin" or "superadmin" in MongoDB
- Log out and log back in
- Clear browser cache
- Check authStore in browser DevTools (Application > Local Storage)

### Issue: Can't access /admin routes
**Solution**:
- Ensure you're logged in
- Verify your role in MongoDB
- Check that token cookie is set
- Try logging out and back in

---

## Development URLs

- **Main App**: http://localhost:3002
- **Login**: http://localhost:3002/login
- **Signup**: http://localhost:3002/signup
- **Dashboard**: http://localhost:3002/dashboard
- **Admin Panel**: http://localhost:3002/admin

---

## MongoDB Connection

Your app is connected to:
```
mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite
```

Database: `EcommerseWebsite`
Collection: `users`

---

## Email Configuration

Configured Gmail account:
- **Email**: rahulkumar9508548671@gmail.com
- **App Password**: mwcx yjca vynm jelx

---

## Next Steps After Testing

1. ✅ Verify OTP emails are working
2. ✅ Test Google OAuth flow
3. ✅ Set up at least one admin user
4. ✅ Test admin panel access
5. 📝 Consider adding more admin features
6. 🔒 Add production security measures
7. 📊 Set up analytics and monitoring

---

## Support

If you encounter any issues:
1. Check the terminal for error logs
2. Check browser console (F12)
3. Verify environment variables in .env.local
4. Check MongoDB connection
5. Review the FIXES_COMPLETED.md document

---

**Happy Testing! 🎉**
