# Elev8ted Roofs - Branding Integration Guide

## 📁 Logo Files Location

Your SVG logos are located at:
```
/Users/kcdacre8tor/reactinator_js/airoofingcode/elev8tion_brand_logos-svg/
```

## 🎨 How to Add Logos to the Application

### Option 1: Copy Logos to Frontend Assets

```bash
# Create assets directory if it doesn't exist
mkdir -p /Users/kcdacre8tor/airoofing-demo/frontend/src/assets

# Copy your logo files
cp /Users/kcdacre8tor/reactinator_js/airoofingcode/elev8tion_brand_logos-svg/* /Users/kcdacre8tor/airoofing-demo/frontend/src/assets/
```

### Option 2: Update Header with Logo

Edit `frontend/src/App.tsx` to include your logo:

```tsx
// Add import at top of file
import logo from './assets/your-logo-name.svg';

// Replace the logo section in the header:
<div className="logo">
  <img src={logo} alt="Elev8ted Roofs" style={{ height: '50px' }} />
  <p className="tagline">AI-Powered Roof Estimation</p>
</div>
```

### Option 3: CSS Background Logo

Edit `frontend/src/App.css`:

```css
.logo::before {
  content: '';
  display: inline-block;
  width: 50px;
  height: 50px;
  background: url('./assets/your-logo.svg') no-repeat center;
  background-size: contain;
  margin-right: 1rem;
}
```

## 🔧 Logo Optimization Tips

### 1. Choose the Right Logo Variant
- **Header:** Use horizontal/wide logo (if available)
- **Favicon:** Use icon/symbol version
- **Footer:** Use monochrome or simplified version

### 2. Update Favicon
```bash
# Copy your icon logo as favicon
cp /path/to/icon-logo.svg /Users/kcdacre8tor/airoofing-demo/frontend/public/favicon.svg
```

Update `frontend/index.html`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

### 3. Color Theme Matching

The app uses these colors (from `frontend/src/index.css`):
```css
--accent-primary: #6366f1    /* Adjust to match your brand */
--accent-secondary: #818cf8  /* Adjust to match your brand */
--accent-dark: #4f46e5       /* Adjust to match your brand */
```

Update these values to match your logo colors!

## 🎯 Recommended Logo Placements

### 1. Header (Top Left)
- Current: Text "ELEV8TED ROOFS"
- Recommended: Replace with your logo SVG
- Size: 40-60px height

### 2. Footer
- Current: Text copyright
- Add: Small logo next to text
- Size: 30-40px height

### 3. Loading State
- Add logo with spinner animation
- Size: 80-100px

### 4. Results PDF Export
- Add logo to generated reports
- Size: As needed for branding

### 5. Favicon
- Browser tab icon
- Size: 32x32px or 64x64px

## 📐 Logo Component Example

Create `frontend/src/components/Logo.tsx`:

```tsx
import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: number;
  className?: string;
}

export function Logo({ variant = 'full', size = 50, className = '' }: LogoProps) {
  // Import your logos
  const logos = {
    full: '/assets/logo-full.svg',
    icon: '/assets/logo-icon.svg',
    text: '/assets/logo-text.svg',
  };

  return (
    <img
      src={logos[variant]}
      alt="Elev8ted Roofs"
      style={{ height: `${size}px` }}
      className={className}
    />
  );
}
```

Usage:
```tsx
import { Logo } from './components/Logo';

// In your component
<Logo variant="full" size={60} />
```

## 🌈 Brand Color Palette

Update your entire color scheme to match brand:

### 1. Edit `frontend/src/index.css`

```css
:root {
  /* Update these to match your brand colors */
  --accent-primary: #YOUR_PRIMARY_COLOR;
  --accent-secondary: #YOUR_SECONDARY_COLOR;
  --accent-dark: #YOUR_DARK_COLOR;

  /* Optional: Update background colors */
  --bg-primary: #YOUR_BG_COLOR;
  --bg-secondary: #YOUR_BG_SECONDARY;
}
```

### 2. Logo-Inspired Gradient

Create gradients matching your logo:

```css
.btn-primary {
  background: linear-gradient(135deg,
    var(--accent-primary) 0%,
    var(--accent-dark) 100%);
}
```

## 🔄 Quick Brand Update Checklist

- [ ] Copy logo SVG files to `frontend/src/assets/`
- [ ] Update header logo in `App.tsx`
- [ ] Update favicon in `public/` folder
- [ ] Update color variables in `index.css`
- [ ] Test logo visibility on dark background
- [ ] Ensure SVG scales properly at different sizes
- [ ] Add logo to footer
- [ ] Optional: Add logo to results/export screens
- [ ] Test on mobile devices
- [ ] Optimize SVG file size if needed

## 🛠️ SVG Optimization

If logo files are too large:

```bash
# Install SVGO
npm install -g svgo

# Optimize SVGs
svgo /Users/kcdacre8tor/reactinator_js/airoofingcode/elev8tion_brand_logos-svg/*.svg --multipass
```

## 📱 Responsive Logo Display

Add responsive sizing in CSS:

```css
.logo img {
  height: 60px;
}

@media (max-width: 768px) {
  .logo img {
    height: 40px;
  }
}
```

## 🎨 Advanced: Animated Logo

Add subtle animation:

```css
.logo img {
  transition: transform 0.3s ease;
}

.logo:hover img {
  transform: scale(1.05);
}
```

---

**Ready to add your branding!** The app is fully customizable and waiting for your Elev8tion brand logos. 🚀
