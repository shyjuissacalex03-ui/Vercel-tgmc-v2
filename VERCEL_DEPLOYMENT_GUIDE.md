# Deploying TGMC to Vercel (vercel.com)

This website is a **Vite + React (TypeScript) Single Page Application (SPA)** with Firebase Firestore, Authentication, and Storage. It is fully configured and ready for 1-click deployment on Vercel.

---

## 1. Quick Deploy Steps

### Method A: Deploy via GitHub / GitLab / Bitbucket (Recommended)
1. Push this codebase to your Git repository (e.g., GitHub).
2. Go to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import your Git repository.
4. Vercel will automatically detect the **Vite** framework preset:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**.

### Method B: Deploy via Vercel CLI
If you have the Vercel CLI installed locally:
```bash
npm install -g vercel
vercel
# Follow the prompts and select default settings
vercel --prod
```

---

## 2. Included Configurations

### SPA Routing (`vercel.json`)
A `vercel.json` file is configured in the root directory:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
**Why this matters:** When visitors open deep URLs (such as `https://your-site.vercel.app/about`, `/events`, `/give`, `/gallery`) or refresh their browser, Vercel routes them to `/index.html` instead of displaying a 404 error.

---

## 3. Critical Firebase Configuration for Vercel

### Allowlist your Vercel Domain in Firebase
To allow users to sign in and use email/password and Google authentication on Vercel:

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **`orbital-talent-vvr20`**.
3. Navigate to **Build** → **Authentication** → **Settings** tab.
4. Scroll down to **Authorized domains**.
5. Click **Add domain** and enter your Vercel domain:
   - `your-project-name.vercel.app`
   - Any custom domain (e.g. `tgmchurch.org.uk`)
6. Click **Save**.

---

## 4. Optional: Environment Variables in Vercel

The application automatically reads the bundled `firebase-applet-config.json`. If you prefer to manage Firebase credentials via Vercel's Environment Variables dashboard, go to **Project Settings → Environment Variables** on Vercel and add:

| Variable Name | Value |
|---|---|
| `VITE_FIREBASE_PROJECT_ID` | `orbital-talent-vvr20` |
| `VITE_FIREBASE_APP_ID` | `1:413770725133:web:01b9b19dc678c64476a244` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyARG3ehu2n1B9NBQ7z-3RkMBIa7UOg2b-o` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `orbital-talent-vvr20.firebaseapp.com` |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | `ai-studio-thegreatmissionc-b0a51e3f-cce4-4e2e-82a7-5d9b232e1cc3` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `orbital-talent-vvr20.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `413770725133` |
