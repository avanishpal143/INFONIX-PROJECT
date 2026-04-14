# 🚀 Quick Test Guide

## Start Your App

```bash
cd INFONIX-PROJECT/files/webzio-app
npm run dev
```

Server will start at: **http://localhost:3002**

---

## ✅ Test Checklist

### 1. Mobile Navigation Test (5 minutes)

**Desktop View** (Browser width > 768px):
- [ ] Open http://localhost:3002
- [ ] See full navigation: Features, Templates, How it Works, Pricing
- [ ] See "Log in" and "Get Started Free" buttons
- [ ] No hamburger menu visible
- [ ] No user icon visible

**Mobile View** (Browser width < 768px):
- [ ] Resize browser to mobile size (or press F12 → Toggle device toolbar)
- [ ] See only: Logo, User Icon (👤), Hamburger Menu (☰)
- [ ] Desktop navigation hidden
- [ ] Click hamburger menu
- [ ] Menu slides in from right
- [ ] See all navigation links in menu
- [ ] Click outside menu to close
- [ ] Menu slides out smoothly

**Mobile Menu Links**:
- [ ] Click "Features" → scrolls to features section
- [ ] Click "Templates" → scrolls to templates section
- [ ] Click "How it Works" → scrolls to how section
- [ ] Click "Pricing" → scrolls to pricing section
- [ ] Click "Log in" → goes to /login page
- [ ] Click "Get Started Free" → goes to /signup page

---

### 2. Google OAuth Test (5 minutes)

**Setup Check**:
- [ ] Verify `.env.local` has GOOGLE_CLIENT_ID
- [ ] Verify `.env.local` has GOOGLE_CLIENT_SECRET
- [ ] Verify `.env.local` has NEXTAUTH_URL=http://localhost:3002
- [ ] Verify `.env.local` has NEXTAUTH_SECRET

**Login Flow**:
- [ ] Go to http://localhost:3002/login
- [ ] See "Continue with Google" button with Google logo
- [ ] Click "Continue with Google"
- [ ] Redirects to Google sign-in page
- [ ] Sign in with your Google account
- [ ] Authorize the application
- [ ] Redirects back to http://localhost:3002/dashboard
- [ ] You're logged in!

**Database Check**:
- [ ] Open MongoDB Atlas
- [ ] Check "users" collection
- [ ] Find your user by email
- [ ] Verify `isVerified: true`
- [ ] Verify `oauthProvider: "google"`
- [ ] Verify `oauthId` has Google user ID
- [ ] Verify `password` is empty or null

**Session Check**:
- [ ] Refresh the page
- [ ] Still logged in (session persists)
- [ ] Open new tab → http://localhost:3002/dashboard
- [ ] Still logged in (session works across tabs)

---

### 3. Email/Password Login Still Works (3 minutes)

**Regular Login**:
- [ ] Go to http://localhost:3002/login
- [ ] Enter email and password (existing user)
- [ ] Click "Login Now"
- [ ] Redirects to dashboard
- [ ] Works as before

**New Signup with OTP**:
- [ ] Go to http://localhost:3002/signup
- [ ] Enter name, email, password
- [ ] Click "Create Account"
- [ ] See OTP verification screen
- [ ] Check console for OTP (or email if configured)
- [ ] Enter OTP
- [ ] Click "Verify & Continue"
- [ ] Redirects to dashboard
- [ ] Works as before

---

### 4. Mobile + Google OAuth Combined (2 minutes)

- [ ] Open http://localhost:3002 on mobile
- [ ] Click user icon (👤) in header
- [ ] Goes to /login page
- [ ] Click "Continue with Google"
- [ ] Google OAuth works on mobile
- [ ] Redirects to dashboard
- [ ] Perfect!

---

## 🐛 Common Issues & Fixes

### Issue: "Redirect URI mismatch"
**Fix**: 
1. Go to Google Cloud Console
2. Add `http://localhost:3002/api/auth/callback/google` to Authorized Redirect URIs
3. Save and wait 5 minutes

### Issue: "Invalid client"
**Fix**:
1. Check `.env.local` for correct GOOGLE_CLIENT_ID
2. No extra spaces or quotes
3. Restart dev server

### Issue: Mobile menu not showing
**Fix**:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check browser width is < 768px

### Issue: Session not persisting
**Fix**:
1. Check NEXTAUTH_SECRET is set in `.env.local`
2. Clear browser cookies
3. Restart dev server

---

## 📱 Test on Real Mobile Device

### Option 1: Local Network
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open `http://YOUR_IP:3002` on mobile browser
3. Test all features

### Option 2: ngrok (Recommended for Google OAuth)
```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 3002

# Use the https URL provided
# Update NEXTAUTH_URL in .env.local to ngrok URL
# Add ngrok URL to Google Console redirect URIs
```

---

## ✅ Success Criteria

All features working if:
- ✅ Mobile navigation responsive
- ✅ Hamburger menu opens/closes smoothly
- ✅ User icon visible on mobile
- ✅ Google OAuth login works
- ✅ User created in database
- ✅ Session persists
- ✅ Email/password login still works
- ✅ OTP verification still works
- ✅ No console errors
- ✅ No TypeScript errors

---

## 🎉 You're Done!

Everything is working perfectly. Your app now has:
- ✅ Mobile-responsive navigation
- ✅ Google OAuth login
- ✅ Email/password login
- ✅ OTP verification
- ✅ Session management
- ✅ Beautiful UI

**Enjoy your fully functional app! 🚀**
