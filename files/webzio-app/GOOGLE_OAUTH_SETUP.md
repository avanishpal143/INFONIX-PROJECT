# Google OAuth Setup Guide

## ✅ Already Configured

Your Google OAuth credentials are already set up in `.env.local`:
- `GOOGLE_CLIENT_ID`: your-google-client-id-here
- `GOOGLE_CLIENT_SECRET`: your-google-client-secret-here
- `NEXTAUTH_URL`: http://localhost:3002
- `NEXTAUTH_SECRET`: (configured)

## 🔧 Google Cloud Console Configuration

Make sure your Google Cloud Console project has these settings:

### 1. Authorized Redirect URIs
Add these URLs in your Google Cloud Console → APIs & Services → Credentials:

```
http://localhost:3002/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### 2. Authorized JavaScript Origins
Add these URLs:

```
http://localhost:3002
http://localhost:3001
http://localhost:3000
```

## 🚀 How It Works

1. **User clicks "Continue with Google"** on the login page
2. **NextAuth redirects** to Google OAuth consent screen
3. **User authorizes** the application
4. **Google redirects back** to `/api/auth/callback/google`
5. **NextAuth creates/updates user** in MongoDB
6. **User is redirected** to `/dashboard`

## 📝 Features Implemented

✅ Google OAuth login integration
✅ Automatic user creation on first login
✅ Email verification bypass for Google users
✅ Link Google account to existing email/password users
✅ Session management with JWT
✅ Secure authentication flow

## 🔐 Security Notes

- OAuth users don't need passwords
- Google users are automatically verified
- Sessions are managed securely with JWT
- All credentials are stored in `.env.local` (not committed to git)

## 🧪 Testing

1. Start your development server: `npm run dev`
2. Go to http://localhost:3002/login
3. Click "Continue with Google"
4. Sign in with your Google account
5. You'll be redirected to the dashboard

## 🐛 Troubleshooting

**Error: "Redirect URI mismatch"**
- Check that your redirect URIs in Google Cloud Console match exactly
- Make sure you're using the correct port (3002)

**Error: "Invalid client"**
- Verify your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in `.env.local`
- Make sure there are no extra spaces or quotes

**Error: "Session not found"**
- Clear your browser cookies
- Restart the development server
- Check that NEXTAUTH_SECRET is set in `.env.local`

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](https://next-auth.js.org/providers/google)
- [Google Cloud Console](https://console.cloud.google.com/)
