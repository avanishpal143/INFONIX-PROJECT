# Fix Google OAuth Error 400: redirect_uri_mismatch

## ❌ Current Error
```
Access blocked: This app's request is invalid
Error 400: redirect_uri_mismatch
```

## 🔧 Solution: Add Redirect URI to Google Cloud Console

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/
2. Login with your Google account (rahulkumar950854867@gmail.com)

### Step 2: Select Your Project
1. Click on the project dropdown (top left)
2. Select your project (the one with Client ID: 928805232883...)

### Step 3: Go to Credentials
1. Click on "APIs & Services" in left menu
2. Click on "Credentials"
3. Find your OAuth 2.0 Client ID
4. Click on it to edit

### Step 4: Add Authorized Redirect URIs
Add these EXACT URLs in "Authorized redirect URIs" section:

```
http://localhost:3002/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### Step 5: Add Authorized JavaScript Origins
Add these URLs in "Authorized JavaScript origins" section:

```
http://localhost:3002
http://localhost:3001
http://localhost:3000
```

### Step 6: Save Changes
1. Click "SAVE" button at bottom
2. Wait 5 minutes for changes to propagate

### Step 7: Test Again
1. Go to http://localhost:3002/login
2. Click "Continue with Google"
3. Should work now! ✅

---

## 📸 Visual Guide

### Where to Add Redirect URIs:
```
Google Cloud Console
  └── APIs & Services
      └── Credentials
          └── OAuth 2.0 Client IDs
              └── [Your Client ID]
                  ├── Authorized JavaScript origins
                  │   ├── http://localhost:3002
                  │   ├── http://localhost:3001
                  │   └── http://localhost:3000
                  │
                  └── Authorized redirect URIs
                      ├── http://localhost:3002/api/auth/callback/google
                      ├── http://localhost:3001/api/auth/callback/google
                      └── http://localhost:3000/api/auth/callback/google
```

---

## 🎯 Quick Checklist

- [ ] Logged into Google Cloud Console
- [ ] Selected correct project
- [ ] Opened OAuth 2.0 Client ID settings
- [ ] Added all 3 redirect URIs (with /api/auth/callback/google)
- [ ] Added all 3 JavaScript origins (without /api/auth/callback/google)
- [ ] Clicked SAVE
- [ ] Waited 5 minutes
- [ ] Tested login again

---

## 🔍 Common Mistakes to Avoid

❌ **Wrong**: `http://localhost:3002/api/auth/callback`
✅ **Correct**: `http://localhost:3002/api/auth/callback/google`

❌ **Wrong**: Adding trailing slash `http://localhost:3002/`
✅ **Correct**: No trailing slash `http://localhost:3002`

❌ **Wrong**: Using HTTPS for localhost `https://localhost:3002`
✅ **Correct**: Use HTTP for localhost `http://localhost:3002`

---

## 🚀 Alternative: Create New OAuth Credentials

If you can't access the existing credentials, create new ones:

### Step 1: Create OAuth 2.0 Client ID
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click "+ CREATE CREDENTIALS"
3. Select "OAuth client ID"
4. Application type: "Web application"
5. Name: "Infonix Cloud - Local Dev"

### Step 2: Configure
**Authorized JavaScript origins:**
```
http://localhost:3002
http://localhost:3001
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3002/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### Step 3: Get New Credentials
1. Click "CREATE"
2. Copy the Client ID
3. Copy the Client Secret

### Step 4: Update .env.local
Replace in `.env.local`:
```env
GOOGLE_CLIENT_ID=your-new-client-id-here
GOOGLE_CLIENT_SECRET=your-new-client-secret-here
```

### Step 5: Restart Server
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## 📞 Need Help?

If still not working:
1. Check if you're using the correct Google account
2. Make sure project is not disabled
3. Verify OAuth consent screen is configured
4. Check if APIs are enabled (Google+ API or People API)

---

## ✅ Success!

Once configured correctly, you should see:
1. Google sign-in page (not error page)
2. Permission request screen
3. Redirect back to your dashboard
4. User logged in successfully

**Your Google OAuth will work perfectly! 🎉**
