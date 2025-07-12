# Environment Configuration

## The Problem

The backend at `https://skill-swap-backend-io0v.onrender.com` is configured with CORS to only allow requests from `https://skill-swap-frontend-02.vercel.app`, but your app is deployed on a different domain.

## Solutions

### Option 1: Update Backend CORS (Recommended)

Contact your backend administrator to add your frontend domain to the CORS whitelist in the backend configuration.

For fly.dev deployment, add this domain to the backend CORS:

```
https://f7f87035b114447299d82f6380a54d19-af70085e2e534b2e98ffa6213.fly.dev
```

### Option 2: Use a Different Backend Environment

If there's a development backend that allows all origins, update your deployment environment variables:

For fly.io:

```bash
flyctl secrets set VITE_API_URL=https://your-dev-backend-url.com
```

### Option 3: Deploy to Vercel (Quick Fix)

Since the backend already allows `https://skill-swap-frontend-02.vercel.app`, deploying there would work immediately.

## Current Environment Detection

The app automatically detects the environment:

- **localhost**: Uses Vite proxy to avoid CORS
- **production**: Uses direct backend URL with CORS

## Environment Variables

Set `VITE_API_URL` to override the default backend URL:

- Development: Leave empty to use proxy
- Production: Set to your backend URL

## Debugging

Check browser console for detailed CORS error messages and current configuration.
