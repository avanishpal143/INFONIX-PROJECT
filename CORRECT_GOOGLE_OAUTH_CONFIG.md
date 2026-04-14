# Correct Google OAuth Configuration ✅

## Your App Settings
- **Running on**: `http://localhost:3002`
- **NextAuth URL**: `http://localhost:3002`

---

## Step-by-Step Fix

### 1. Authorized JavaScript Origins
**REMOVE ALL** the current URLs and add ONLY these:

```
http://localhost:3002
```

That's it! Just one URL for your actual port.

Optional (if you want to test on other ports):
```
http://localhost:3001
http://localhost:3000
```

---

### 2. Authorized Redirect URIs
**REMOVE ALL** the current URLs and add ONLY these:

```
http://localhost:3002/api/auth/callback/google
```

Optional (if you want to test on other ports):
```
http://localhost:3001/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

---

## What's Wrong with Your Current Setup?

### ❌ Authorized JavaScript Origins (Too Many URLs)
You have:
- `https://e-commerce-store-inky-nine.vercel.app` ← Production URL (keep if deployed)
- `http://127.0.0.1:8000` ← Wrong port
- `http://localhost:5174` ← Wrong port (Vite default)
- `http://127.0.0.1:8001` ← Wrong port
- `http://localhost:5000` ← Wrong port
- Multiple Vercel URLs ← Not needed for local dev
- `http://127.0.0.1:5001/api/auth/google` ← This is a redirect URI, not origin!
- `http://localhost:5001/api/auth/google` ← This is a redirect URI, not origin!

**You only need**: `http://localhost:3002`

### ⚠️ Authorized Redirect URIs (Mixed Correct/Wrong)
**CORRECT** (keep these):
- ✅ `http://localhost:3002/api/auth/callback/google` (URI 15)
- ✅ `http://localhost:3001/api/auth/callback/google` (URI 14)
- ✅ `http://localhost:3000/api/auth/callback/google` (URI 13)

**WRONG** (remove these):
- ❌ `http://localhost:5001/api/auth/google` (URI 12) - missing `/callback`
- ❌ `http://127.0.0.1:5001/api/auth/google` (URI 11) - missing `/callback`

---

## Clean Configuration (Recommended)

### For Local Development Only:

**Authorized JavaScript origins:**
```
http://localhost:3002
```

**Authorized redirect URIs:**
```
http://localhost:3002/api/auth/callback/google
```

### For Local Development + Production:

**Authorized JavaScript origins:**
```
http://localhost:3002
https://your-production-domain.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:3002/api/auth/callback/google
https://your-production-domain.vercel.app/api/auth/callback/google
```

---

## Key Points to Remember

1. **JavaScript Origins** = Base URL only (no path)
   - ✅ `http://localhost:3002`
   - ❌ `http://localhost:3002/api/auth/callback/google`

2. **Redirect URIs** = Full callback path
   - ✅ `http://localhost:3002/api/auth/callback/google`
   - ❌ `http://localhost:3002`

3. **Port must match** your NEXTAUTH_URL in `.env.local`
   - Your app runs on port **3002**
   - So use `http://localhost:3002`

4. **Path must be exact**
   - ✅ `/api/auth/callback/google` (correct)
   - ❌ `/api/auth/google` (wrong - missing `/callback`)

5. **No trailing slashes**
   - ✅ `http://localhost:3002`
   - ❌ `http://localhost:3002/`

---

## After Making Changes

1. Click **SAVE** in Google Cloud Console
2. Wait **5 minutes** for changes to propagate
3. Clear your browser cache or use incognito mode
4. Test the login at: `http://localhost:3002/login`
5. Click "Continue with Google"
6. Should work now! ✅

---

## Testing Checklist

- [ ] Removed all unnecessary JavaScript origins
- [ ] Added only `http://localhost:3002` to JavaScript origins
- [ ] Removed wrong redirect URIs (the ones with `/api/auth/google`)
- [ ] Kept correct redirect URIs (the ones with `/api/auth/callback/google`)
- [ ] Clicked SAVE in Google Cloud Console
- [ ] Waited 5 minutes
- [ ] Cleared browser cache
- [ ] Tested login

---

## Still Not Working?

If you still see errors after this:

1. **Check your .env.local file**
   - Make sure `NEXTAUTH_URL=http://localhost:3002`
   - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

2. **Restart your dev server**
   ```bash
   # Stop the server (Ctrl+C)
   cd INFONIX-PROJECT/files/webzio-app
   npm run dev
   ```

3. **Check the browser console** for error messages

4. **Verify MongoDB connection** is working

---

**Your Google OAuth will work once you clean up the configuration! 🎉**
