# Logo Setup Instructions

## Add Your Logo Image

1. Save the medical icon image as `logo.png`
2. Place it in `patient-emr-frontend/public/logo.png`
3. The image will automatically be used as:
   - Favicon (browser tab icon)
   - Landing page navbar logo
   - Dashboard sidebar logo (all 4 portals)
   - Login page logo

## Image Requirements

- **Format**: PNG with transparent background (recommended)
- **Size**: 512x512px or larger (will be scaled down automatically)
- **File name**: Must be exactly `logo.png`
- **Location**: `patient-emr-frontend/public/logo.png`

## After Adding the Logo

Restart the dev server:
```bash
npm start
```

Or rebuild for production:
```bash
npm run build
```

The logo will appear everywhere the old heart icon was shown.
