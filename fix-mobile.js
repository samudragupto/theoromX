const fs = require('fs');

// Fresh build first
const { execSync } = require('child_process');
execSync('node build-single.js', { cwd: __dirname, stdio: 'inherit' });

let content = fs.readFileSync('theoremx_mobile.html', 'utf-8');

// ══════════════════════════════════════════════════════════════════
// Extract base64 logos already embedded in the file
// ══════════════════════════════════════════════════════════════════
const audiLogoMatch = content.match(/src="(data:image\/png;base64,[^"]{500,})" alt="AUDI"/);
const audiLogoSrc = audiLogoMatch ? audiLogoMatch[1] : '';
console.log('AUDI logo:', audiLogoSrc ? '✓ found' : '✗ missing');

const clgLogoMatch = content.match(/src="(data:image\/png;base64,[^"]{500,})" alt="Dr\. M\.G\.R\. ERI Logo"/);
const clgLogoSrc = clgLogoMatch ? clgLogoMatch[1] : '';
console.log('CLG logo:', clgLogoSrc ? '✓ found' : '✗ missing');

// ══════════════════════════════════════════════════════════════════
// 1. INJECT MOBILE OVERRIDE STYLES (right before </head>)
//    — uses !important to guarantee override of all existing rules
// ══════════════════════════════════════════════════════════════════
const mobileOverrideCSS = `
<style id="mobile-overrides">
/* ======================================================
   MOBILE OVERRIDES — injected fixes
   ====================================================== */

/* ── 1. Hero title — scale to fit mobile screen ── */
@media (max-width: 768px) {
  .hero-title {
    overflow: hidden !important;
    width: 100% !important;
  }
  .hero-theoremx {
    font-size: clamp(2rem, 8.5vw, 3.2rem) !important;
    letter-spacing: -0.02em !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: clip !important;
  }
  .hero-year {
    font-size: clamp(1.4rem, 6vw, 2.5rem) !important;
    letter-spacing: -0.02em !important;
  }
  .hero-inner {
    overflow: hidden !important;
    padding-left: 1.25rem !important;
    padding-right: 1.25rem !important;
    padding-top: 1.25rem !important;
  }
}
@media (max-width: 480px) {
  .hero-theoremx {
    font-size: clamp(1.8rem, 8vw, 2.8rem) !important;
  }
  .hero-year {
    font-size: clamp(1.2rem, 5.5vw, 2rem) !important;
  }
}

/* ── 2. AUDI logo in nav (mobile) ── */
.nav-audi-logo-top {
  height: 20px !important;
  opacity: 0.82 !important;
  margin-left: 8px !important;
  flex-shrink: 0 !important;
  display: inline-block !important;
}

/* ── 3. Mobile nav overlay (tap outside to close) ── */
.mobile-nav-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 998;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.mobile-nav-overlay.open {
  display: block;
  opacity: 1;
}
/* Make sure mobile nav is above overlay */
.mobile-nav { z-index: 999 !important; }

/* ── 4. Close button — larger tap target ── */
.mobile-nav-close {
  width: 48px !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  background: rgba(95,74,139,0.1) !important;
  cursor: pointer !important;
}

/* ── 5. Footer logos row ── */
.footer-logos-row {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 1.5rem !important;
  padding: 1.5rem 1rem !important;
  border-top: 1px solid rgba(255,255,255,0.1) !important;
  border-bottom: 1px solid rgba(255,255,255,0.1) !important;
  margin: 1.5rem 0 !important;
  flex-wrap: wrap !important;
}
.footer-logos-row img {
  object-fit: contain !important;
  max-height: 48px !important;
}

/* ── 6. Hero animations ── */
@keyframes heroReveal {
  0%   { opacity: 0; transform: translateY(32px) scale(0.94); filter: blur(6px); }
  65%  { opacity: 1; transform: translateY(-3px) scale(1.01); filter: blur(0); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes yearSlide {
  0%   { opacity: 0; transform: translateX(-24px); letter-spacing: 0.2em; }
  100% { opacity: 1; transform: translateX(0); letter-spacing: -0.02em; }
}
@keyframes badgeFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}
@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(95,74,139,0.5); }
  50%       { box-shadow: 0 0 0 6px rgba(95,74,139,0); }
}
@keyframes orbPulse1 {
  0%, 100% { transform: translate(0,0) scale(1); opacity: 0.6; }
  40%       { transform: translate(18px,-28px) scale(1.12); opacity: 0.8; }
  75%       { transform: translate(-12px,16px) scale(0.95); opacity: 0.5; }
}
@keyframes orbPulse2 {
  0%, 100% { transform: translate(0,0) scale(1); opacity: 0.5; }
  50%       { transform: translate(-20px,22px) scale(1.08); opacity: 0.7; }
}

.hero-theoremx { animation: heroReveal 0.85s cubic-bezier(0.22,1,0.36,1) 0.1s both !important; }
.hero-year      { animation: yearSlide 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both !important; }
.hero-badge     { animation: badgeFloat 3.5s ease-in-out 1.2s infinite !important; opacity: 1 !important; }
.badge-dot      { animation: dotPulse 2s ease-in-out infinite !important; }
.hero-orb-1     { animation: orbPulse1 9s ease-in-out infinite !important; }
.hero-orb-2     { animation: orbPulse2 11s ease-in-out infinite !important; }
.hero-orb-3     { animation: orbPulse1 13s ease-in-out 3s infinite reverse !important; }

/* SDG dots */
.sdg-dot-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
  max-width: 110px;
}
.sdg-dot {
  width: 13px;
  height: 13px;
  border-radius: 2px;
}
</style>
`;

content = content.replace('</head>', mobileOverrideCSS + '\n</head>');

// ══════════════════════════════════════════════════════════════════
// 2. ADD MOBILE NAV OVERLAY DIV (before mobile-nav div)
// ══════════════════════════════════════════════════════════════════
if (!content.includes('mobile-nav-overlay')) {
  content = content.replace(
    '<div class="mobile-nav" id="mobileNav"',
    '<div class="mobile-nav-overlay" id="mobileNavOverlay"></div>\n  <div class="mobile-nav" id="mobileNav"'
  );
  console.log('✓ Overlay div added');
}

// ══════════════════════════════════════════════════════════════════
// 3. ADD AUDI LOGO IN NAV (next to brand text)
// ══════════════════════════════════════════════════════════════════
if (audiLogoSrc && !content.includes('nav-audi-logo-top')) {
  // Add after the nav-brand-text closing div, before closing nav-brand div
  content = content.replace(
    `<span class="brand-sub">Dept. of Data Science</span>
        </div>
      </div>`,
    `<span class="brand-sub">Dept. of Data Science</span>
        </div>
        <img src="${audiLogoSrc}" alt="AUDI" class="nav-audi-logo-top" />
      </div>`
  );
  console.log('✓ AUDI logo in nav added');
}

// ══════════════════════════════════════════════════════════════════
// 4. FIX JS — mobile nav close/open with overlay
// ══════════════════════════════════════════════════════════════════
// Replace the entire mobile nav JS block with a robust version
const oldNavJS = `  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobileNav');
  const navClose    = document.getElementById('mobileNavClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    hamburger?.classList.add('open');
    mobileNav?.classList.add('open');
    mobileNav?.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    mobileNav?.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMobileNav);
  navClose?.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(l => l.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });`;

const newNavJS = `  const hamburger       = document.getElementById('hamburger');
  const mobileNav       = document.getElementById('mobileNav');
  const navClose        = document.getElementById('mobileNavClose');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks     = document.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    hamburger?.classList.add('open');
    mobileNav?.classList.add('open');
    mobileNavOverlay?.classList.add('open');
    mobileNav?.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    mobileNavOverlay?.classList.remove('open');
    mobileNav?.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMobileNav);
  navClose?.addEventListener('click', closeMobileNav);
  mobileNavOverlay?.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(l => l.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });`;

if (content.includes(oldNavJS)) {
  content = content.replace(oldNavJS, newNavJS);
  console.log('✓ Nav JS fixed');
} else {
  console.log('⚠ Could not find exact nav JS block — trying partial fix');
  // Partial fix: just inject the overlay listener before Escape handler
  content = content.replace(
    `document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });`,
    `const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
      mobileNavOverlay.classList.remove('open');
      mobileNav?.setAttribute('aria-hidden', 'true');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });`
  );
  console.log('✓ Nav JS partial fix applied');
}

// ══════════════════════════════════════════════════════════════════
// 5. ADD LOGOS TO FOOTER (before footer-bottom)
// ══════════════════════════════════════════════════════════════════
const sdgColors = [
  '#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21',
  '#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367',
  '#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B',
  '#00689D','#19486A'
];
const sdgDots = sdgColors.map((c, i) =>
  `<div class="sdg-dot" title="SDG ${i+1}" style="background:${c}"></div>`
).join('');

const footerLogos = `
      <!-- Logos row (CLG + AUDI + SDG) -->
      <div class="footer-logos-row">
        ${clgLogoSrc ? `<img src="${clgLogoSrc}" alt="Dr. M.G.R. ERI" style="height:52px;filter:brightness(1.3) saturate(1.1);" />` : ''}
        ${audiLogoSrc ? `<img src="${audiLogoSrc}" alt="AUDI" style="height:32px;filter:brightness(1.5);opacity:0.9;" />` : ''}
        <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
          <div class="sdg-dot-grid">${sdgDots}</div>
          <span style="font-size:0.5rem;color:rgba(255,255,255,0.45);letter-spacing:0.12em;text-transform:uppercase;font-weight:700;">SDG Goals</span>
        </div>
      </div>`;

if (!content.includes('footer-logos-row')) {
  content = content.replace(
    '<div class="footer-bottom">',
    footerLogos + '\n      <div class="footer-bottom">'
  );
  console.log('✓ Footer logos added');
} else {
  console.log('⚠ Footer logos already present — skipping');
}

// ══════════════════════════════════════════════════════════════════
// SAVE
// ══════════════════════════════════════════════════════════════════
fs.writeFileSync('theoremx_mobile.html', content, 'utf-8');
const sizeMB = (fs.statSync('theoremx_mobile.html').size / 1024 / 1024).toFixed(2);
console.log(`\n✅ Done! theoremx_mobile.html → ${sizeMB} MB`);
