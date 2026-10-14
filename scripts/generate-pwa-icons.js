/**
 * PRATIK PHATAKE (प्रतीक फटाके) — High-Resolution PWA Icon Generator
 * Generates all standard PWA, iOS, and favicon PNGs and SVGs
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Vector SVG Icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="60%" stop-color="#5521B5" />
      <stop offset="100%" stop-color="#2E1065" />
    </radialGradient>
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF08A" stop-opacity="1" />
      <stop offset="40%" stop-color="#FBBF24" stop-opacity="0.8" />
      <stop offset="80%" stop-color="#F59E0B" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#D97706" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444" />
      <stop offset="50%" stop-color="#F97316" />
      <stop offset="100%" stop-color="#FBBF24" />
    </linearGradient>
    <linearGradient id="diyaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background with smooth rounded squircle -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)" />

  <!-- Outer Fireworks Sparks -->
  <circle cx="256" cy="230" r="140" fill="url(#goldGlow)" />

  <!-- Fireworks Ray Rays -->
  <g stroke="#FDE047" stroke-width="4" stroke-linecap="round" opacity="0.9" filter="url(#glow)">
    <line x1="256" y1="90" x2="256" y2="40" />
    <line x1="256" y1="370" x2="256" y2="420" />
    <line x1="116" y1="230" x2="66" y2="230" />
    <line x1="396" y1="230" x2="446" y2="230" />

    <line x1="157" y1="131" x2="122" y2="96" />
    <line x1="355" y1="131" x2="390" y2="96" />
    <line x1="157" y1="329" x2="122" y2="364" />
    <line x1="355" y1="329" x2="390" y2="364" />

    <!-- Extra Sparkling Embers -->
    <circle cx="210" cy="110" r="6" fill="#F43F5E" />
    <circle cx="302" cy="110" r="6" fill="#38BDF8" />
    <circle cx="130" cy="190" r="7" fill="#10B981" />
    <circle cx="382" cy="190" r="7" fill="#FBBF24" />
    <circle cx="140" cy="280" r="5" fill="#F43F5E" />
    <circle cx="372" cy="280" r="5" fill="#A855F7" />
  </g>

  <!-- Central Festive Fireworks Rocket & Diya Combination -->
  <g transform="translate(256, 220)">
    <!-- Rocket Body tilted at 45 deg -->
    <g transform="rotate(-30)">
      <!-- Exhaust Flame -->
      <polygon points="-8,70 8,70 0,110" fill="#EF4444" opacity="0.9" />
      <polygon points="-5,70 5,70 0,95" fill="#FBBF24" />
      
      <!-- Rocket Cylinder -->
      <rect x="-14" y="-50" width="28" height="120" rx="6" fill="url(#rocketGrad)" stroke="#FEF08A" stroke-width="2" />
      
      <!-- Rocket Nose Cone -->
      <polygon points="0,-95 -20,-50 20,-50" fill="#DC2626" stroke="#FEF08A" stroke-width="2" />
      
      <!-- Decorative Bands -->
      <line x1="-14" y1="-20" x2="14" y2="-20" stroke="#FFFFFF" stroke-width="3" />
      <line x1="-14" y1="20" x2="14" y2="20" stroke="#FDE047" stroke-width="3" />
    </g>

    <!-- Radiating Starburst Burst at Head -->
    <path d="M -45,-90 L -10,-80 L -30,-50 L 0,-65 L 10,-40 L 25,-70 L 50,-80 L 25,-95 L 45,-125 L 10,-110 L 0,-140 L -15,-110 Z" fill="#FDE047" filter="url(#glow)" />
    <circle cx="-5" cy="-85" r="14" fill="#FFFFFF" />
  </g>

  <!-- Golden Brand Banner Ribbon at Bottom -->
  <g transform="translate(256, 435)">
    <rect x="-190" y="-32" width="380" height="54" rx="27" fill="#1E0A3C" stroke="#FBBF24" stroke-width="3" />
    <text x="0" y="5" font-family="'Mukta', sans-serif" font-size="28" font-weight="900" fill="#FDE047" text-anchor="middle" letter-spacing="1">
      प्रतीक फटाके
    </text>
  </g>
</svg>`;

// Write SVGs
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'logo.svg'), svgIcon);

// Maskable SVG (larger safe area)
const maskableSvg = svgIcon.replace('rx="128"', 'rx="0"');
fs.writeFileSync(path.join(iconsDir, 'icon-maskable.svg'), maskableSvg);

// 2. Pure Node.js Canvas-free PNG Generator
function crc32(buf) {
  let table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function createIconPng(size, isMaskable = false) {
  const width = size;
  const height = size;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const cx = width / 2;
  const cy = height * 0.46;
  const maxR = width * 0.44;

  for (let y = 0; y < height; y++) {
    scanlines[offset++] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Squircle corner check for non-maskable icons
      let inSquircle = true;
      if (!isMaskable) {
        const cornerR = width * 0.22;
        const qx = Math.max(0, Math.abs(x - width / 2) - (width / 2 - cornerR));
        const qy = Math.max(0, Math.abs(y - height / 2) - (height / 2 - cornerR));
        if (qx * qx + qy * qy > cornerR * cornerR) {
          inSquircle = false;
        }
      }

      if (!inSquircle) {
        scanlines[offset++] = 0;
        scanlines[offset++] = 0;
        scanlines[offset++] = 0;
        scanlines[offset++] = 0; // Transparent
        continue;
      }

      // Background Gradient: Deep Royal Violet (#7C3AED) to Dark Violet (#2E1065)
      const gradT = Math.min(1, Math.max(0, (y / height) * 0.9 + (x / width) * 0.2));
      let r = Math.round(124 * (1 - gradT) + 46 * gradT);
      let g = Math.round(58 * (1 - gradT) + 16 * gradT);
      let b = Math.round(237 * (1 - gradT) + 101 * gradT);
      let a = 255;

      // Golden Sparkler Rays radiating
      const rayCount = 12;
      const rayAngle = (angle + Math.PI * 2) % ((Math.PI * 2) / rayCount);
      const rayDist = Math.abs(rayAngle - Math.PI / rayCount);
      if (rayDist < 0.08 && dist > width * 0.12 && dist < maxR) {
        // Bright Golden Spark Ray
        const sparkT = 1 - (dist / maxR);
        r = Math.min(255, r + Math.round(250 * sparkT));
        g = Math.min(255, g + Math.round(210 * sparkT));
        b = Math.min(255, b + Math.round(60 * sparkT));
      }

      // Center Firework Glow
      if (dist < width * 0.28) {
        const glowFactor = 1 - (dist / (width * 0.28));
        r = Math.min(255, Math.round(r + 251 * glowFactor * 0.8));
        g = Math.min(255, Math.round(g + 191 * glowFactor * 0.7));
        b = Math.min(255, Math.round(b + 36 * glowFactor * 0.4));
      }

      // Center Core White-Hot Star
      if (dist < width * 0.08) {
        const coreT = 1 - (dist / (width * 0.08));
        r = Math.min(255, Math.round(r + 255 * coreT));
        g = Math.min(255, Math.round(g + 250 * coreT));
        b = Math.min(255, Math.round(b + 200 * coreT));
      }

      // Diya Base at Bottom
      const diyaY = height * 0.65;
      const diyaDx = Math.abs(x - cx);
      const diyaDy = y - diyaY;
      if (diyaDy >= 0 && diyaDy < height * 0.12 && diyaDx < (width * 0.22 * (1 - (diyaDy / (height * 0.15))))) {
        // Diya terracotta gold gradient
        r = 234;
        g = 140;
        b = 20;
      }

      // Bottom Banner Background Bar
      const bannerTop = height * 0.80;
      const bannerBottom = height * 0.94;
      if (y >= bannerTop && y <= bannerBottom && Math.abs(x - cx) < width * 0.42) {
        r = 28;
        g = 10;
        b = 58; // Deep banner fill
        // Gold border
        if (y === Math.round(bannerTop) || y === Math.round(bannerBottom) || Math.abs(x - cx) >= width * 0.40) {
          r = 251;
          g = 191;
          b = 36;
        }
      }

      scanlines[offset++] = r;
      scanlines[offset++] = g;
      scanlines[offset++] = b;
      scanlines[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(scanlines);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 384, 512];

console.log("Generating PWA PNG icons...");
for (const s of sizes) {
  const buf = createIconPng(s, false);
  const fileName = s === 180 ? 'apple-touch-icon.png' : `icon-${s}x${s}.png`;
  fs.writeFileSync(path.join(iconsDir, fileName), buf);
  if (s === 180) {
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), buf);
  }
  if (s === 192 || s === 512) {
    // Also create maskable
    const maskableBuf = createIconPng(s, true);
    fs.writeFileSync(path.join(iconsDir, `icon-maskable-${s}x${s}.png`), maskableBuf);
  }
  console.log(` + ${fileName} (${s}x${s}) created`);
}

// Write favicon 32x32 to public
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), createIconPng(32, false));
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.png'), createIconPng(32, false));

console.log("All PWA icons generated successfully in public/icons!");
