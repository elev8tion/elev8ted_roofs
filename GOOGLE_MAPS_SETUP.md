# 🗺️ Google Maps Static API Setup

Your app is **almost fully functional**! The only missing piece is the **Google Maps Static API** which provides satellite imagery.

## Current Status

✅ **Working:**
- Address geocoding (finding coordinates)
- Manual roof drawing on canvas
- Measurement calculations
- Cost estimation

⚠️ **Needs Setup:**
- Satellite imagery display
- AI automatic roof detection

## Quick Fix: Enable Google Maps Static API

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/library/static-maps-backend.googleapis.com

### Step 2: Enable the API
1. Click **"Enable"** button
2. Wait 2-3 minutes for activation

### Step 3: Enable Billing (Required)
Google Maps APIs require billing to be enabled, even though they offer a free tier:
- $200 free credit per month
- Static Maps API: $2 per 1,000 requests (covered by free credit)
- First 28,500 requests/month are FREE

**To enable billing:**
1. Go to: https://console.cloud.google.com/billing
2. Link a billing account (credit card required but won't be charged for free tier usage)

### Step 4: Verify Your API Key
Your API key should have these APIs enabled:
- ✅ Geocoding API (already working)
- ⚠️ Maps Static API (needs to be enabled)

### Step 5: Test It
After enabling the API and billing, refresh your browser and try any address!

---

## Alternative: Use Without Satellite Imagery

**Your app works right now** - just without satellite images. You can:

1. Enter any address
2. Click "Find Property"
3. Manually click on the canvas to draw the roof outline (4-5 points)
4. Click "Calculate" to get measurements and cost estimate

The canvas will show coordinates but no satellite image. This is perfect for:
- Demo purposes
- Testing the calculation logic
- Showing to investors before adding billing

---

## Cost Breakdown

**Monthly Free Tier:**
- Static Maps API: 28,500 requests FREE
- Geocoding API: 40,000 requests FREE
- After free tier: ~$2 per 1,000 additional requests

**For a roofing business:**
- 100 estimates/month = **FREE**
- 500 estimates/month = **FREE**
- 1,000 estimates/month = **FREE**
- Only pay if you exceed 28,500 estimates per month!

---

## Need Help?

If you encounter issues:
1. Check billing is enabled: https://console.cloud.google.com/billing
2. Verify API is enabled: https://console.cloud.google.com/apis/library/static-maps-backend.googleapis.com
3. Wait 2-3 minutes after enabling for changes to propagate

**The app is fully functional** - satellite imagery just makes it prettier! 🚀
