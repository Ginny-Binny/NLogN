const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

const iconSvg = `
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#A78BFA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#A78BFA;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:0.1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="#0F0F0F"/>
  <circle cx="512" cy="480" r="350" fill="url(#glow)"/>
  <text x="512" y="580" font-family="Arial Black, Arial" font-weight="900" font-size="620" fill="url(#grad1)" text-anchor="middle">G</text>
  <rect x="290" y="720" width="444" height="12" rx="6" fill="url(#grad1)" opacity="0.8"/>
  <text x="512" y="870" font-family="Courier" font-size="80" fill="#555555" text-anchor="middle" letter-spacing="8">&lt;/&gt;</text>
</svg>`;

const adaptiveIconSvg = `
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#A78BFA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="#0F0F0F"/>
  <text x="512" y="600" font-family="Arial Black, Arial" font-weight="900" font-size="620" fill="url(#grad1)" text-anchor="middle">G</text>
</svg>`;

const splashSvg = `
<svg width="1284" height="2778" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#A78BFA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="bgGlow" cx="50%" cy="42%" r="40%">
      <stop offset="0%" style="stop-color:#A78BFA;stop-opacity:0.08" />
      <stop offset="100%" style="stop-color:#0F0F0F;stop-opacity:0" />
    </radialGradient>
  </defs>
  <rect width="1284" height="2778" fill="#0F0F0F"/>
  <rect width="1284" height="2778" fill="url(#bgGlow)"/>
  <text x="642" y="1250" font-family="Arial Black, Arial" font-weight="900" font-size="400" fill="url(#grad1)" text-anchor="middle" opacity="0.15">G</text>
  <text x="642" y="1250" font-family="Arial Black, Arial" font-weight="900" font-size="400" fill="url(#grad1)" text-anchor="middle">G</text>
  <text x="642" y="1450" font-family="Arial, Helvetica" font-weight="900" font-size="100" fill="#F0F0F0" text-anchor="middle" letter-spacing="20">GRIND</text>
  <text x="642" y="1530" font-family="Arial, Helvetica" font-weight="400" font-size="40" fill="#555555" text-anchor="middle">DSA Revision, Reimagined</text>
  <rect x="542" y="1380" width="200" height="6" rx="3" fill="url(#grad1)" opacity="0.6"/>
</svg>`;

const faviconSvg = `
<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#A78BFA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="10" fill="#0F0F0F"/>
  <text x="24" y="35" font-family="Arial Black, Arial" font-weight="900" font-size="32" fill="url(#grad1)" text-anchor="middle">G</text>
</svg>`;

async function generate() {
  console.log('Generating assets...');
  await sharp(Buffer.from(iconSvg)).resize(1024, 1024).png().toFile(path.join(assetsDir, 'icon.png'));
  console.log('  icon.png');
  await sharp(Buffer.from(adaptiveIconSvg)).resize(1024, 1024).png().toFile(path.join(assetsDir, 'adaptive-icon.png'));
  console.log('  adaptive-icon.png');
  await sharp(Buffer.from(splashSvg)).resize(1284, 2778).png().toFile(path.join(assetsDir, 'splash-icon.png'));
  console.log('  splash-icon.png');
  await sharp(Buffer.from(faviconSvg)).resize(48, 48).png().toFile(path.join(assetsDir, 'favicon.png'));
  console.log('  favicon.png');
  console.log('Done!');
}

generate().catch(console.error);
