# Persona AI - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### 1. Prerequisites
- Vercel account (free tier available)
- Google Gemini API key
- Supabase account (optional, for database)

### 2. Deploy to Vercel

#### Option A: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/persona-ai)

#### Option B: Manual Deploy
1. **Connect to Vercel:**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:

   ```
   GEMINI_API_KEY=AIzaSyCXdREphbYuP7FZkxofa2tcaUDDPtwnfBU
   NEXT_PUBLIC_URL=https://your-app.vercel.app
   NEXT_PUBLIC_FRAME_NAME=Persona AI
   NEXT_PUBLIC_FRAME_DESCRIPTION=Live Multiple Digital Lives Through AI Clones
   NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY=AI
   NEXT_PUBLIC_FRAME_TAGS=AI,Simulation,Decision Making,Personal Growth,Farcaster
   NEXT_PUBLIC_FRAME_BUTTON_TEXT=Start Your AI Journey
   NEXT_PUBLIC_USE_WALLET=true
   ```

3. **Optional - Supabase Setup:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Build Configuration

The project is optimized for Vercel with:
- ✅ **Next.js 15** with App Router
- ✅ **Serverless Functions** for API routes
- ✅ **Edge Runtime** compatibility
- ✅ **Static Generation** for landing page
- ✅ **No Three.js dependencies** (removed for Vercel compatibility)

### 4. Environment Variables

#### Required Variables:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `NEXT_PUBLIC_URL`: Your deployed app URL

#### Optional Variables:
- `NEXT_PUBLIC_SUPABASE_URL`: For database functionality
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: For database functionality
- `NEYNAR_API_KEY`: For Farcaster integration
- `NEYNAR_CLIENT_ID`: For Farcaster integration

### 5. Build Process

Vercel will automatically:
1. Install dependencies with `npm install --legacy-peer-deps`
2. Build the project with `npm run build`
3. Deploy to global CDN
4. Set up serverless functions

### 6. Testing Your Deployment

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check for any build errors

2. **Test API Endpoints:**
   ```bash
   curl https://your-app.vercel.app/api/personality/analyze
   ```

3. **Test Gemini Integration:**
   - Navigate to your app
   - Try the personality capture feature
   - Check browser console for errors

### 7. Performance Optimization

The app is optimized for Vercel with:
- **Edge Functions**: Fast API responses
- **Static Generation**: Instant page loads
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic bundle optimization
- **CDN Distribution**: Global edge caching

### 8. Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: Check API performance
- **Error Tracking**: Automatic error reporting

### 9. Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update `NEXT_PUBLIC_URL` environment variable

### 10. Troubleshooting

#### Common Issues:

1. **Build Failures:**
   - Check Node.js version (should be 18.x)
   - Verify all dependencies are compatible
   - Check for TypeScript errors

2. **API Errors:**
   - Verify `GEMINI_API_KEY` is correct
   - Check API key permissions
   - Review function logs

3. **Performance Issues:**
   - Check Vercel Analytics
   - Optimize images and assets
   - Review bundle size

### 11. Production Checklist

- ✅ Environment variables set
- ✅ API keys configured
- ✅ Build successful
- ✅ Functions deployed
- ✅ Domain configured (if custom)
- ✅ Analytics enabled
- ✅ Error monitoring set up

## 🎉 Success!

Your Persona AI app is now live on Vercel with:
- ⚡ **Fast Performance**: Edge-optimized delivery
- 🔒 **Secure**: HTTPS and security headers
- 📱 **Mobile Ready**: Responsive design
- 🤖 **AI Powered**: Gemini integration working
- 🚀 **Scalable**: Serverless architecture

**Your app URL:** `https://your-app.vercel.app`
