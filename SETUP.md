# Google OAuth 2.0 Setup Guide

## 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > OAuth consent screen**.
   - Choose **External** (or Internal if you only want org users).
   - Fill in the required fields (App name, User support email, Developer contact email).
   - Add scopes: `.../auth/userinfo.email` and `.../auth/userinfo.profile`.
   - Add test users if your app is in "Testing" mode.
4. Navigate to **APIs & Services > Credentials**.
   - Click **Create Credentials > OAuth client ID**.
   - Application type: **Web application**.
   - **Authorized JavaScript origins**: `http://localhost:5174` (your Vite dev server).
   - **Authorized redirect URIs**: `http://localhost:5174` (for postMessage auth-code flow).
5. Copy your **Client ID** and **Client Secret**.

## 2. Local Development Setup

### Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `DATABASE_URL`
4. Run migrations: `npx prisma db push`
5. Start server: `npm run dev`

### Frontend
1. `cd frontend`
2. Update your `.env` file with `VITE_GOOGLE_CLIENT_ID`.
3. Wrap your app with `GoogleOAuthProvider` from `@react-oauth/google`.
   ```tsx
   import { GoogleOAuthProvider } from '@react-oauth/google';
   
   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
     <App />
   </GoogleOAuthProvider>
   ```
4. Start Vite: `npm run dev`

## 3. Production Checklist
- [ ] OAuth Consent screen verified by Google.
- [ ] Authorized JavaScript origins and redirect URIs updated for the production domain.
- [ ] Database credentials properly secured.
- [ ] `NODE_ENV=production` set on the backend.
- [ ] Ensure `SESSION_SECRET` is strong and securely stored.
- [ ] Redis or similar configured if clustering (Express).
