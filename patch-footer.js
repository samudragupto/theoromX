const fs = require('fs');

let content = fs.readFileSync('theoremx_mobile.html', 'utf-8');

// Extract logos
const audiLogoMatch = content.match(/src="(data:image\/png;base64,[^"]{500,})" alt="AUDI"/);
const audiLogoSrc = audiLogoMatch ? audiLogoMatch[1] : '';

const clgLogoMatch = content.match(/src="(data:image\/png;base64,[^"]{500,})" alt="Dr\. M\.G\.R\. ERI Logo"/);
const clgLogoSrc = clgLogoMatch ? clgLogoMatch[1] : '';

console.log('AUDI:', audiLogoSrc ? '✓' : '✗');
console.log('CLG:', clgLogoSrc ? '✓' : '✗');

// SDG 17 colors
const sdgColors = [
  '#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21',
  '#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367',
  '#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B',
  '#00689D','#19486A'
];
const sdgDots = sdgColors.map((c, i) =>
  `<div class="sdg-dot" title="SDG ${i+1}" style="background:${c}"></div>`
).join('');

// Build footer logos HTML
const footerLogosHTML = `
      <!-- ── Partner & SDG Logos ── -->
      <div class="footer-logos-row">
        ${clgLogoSrc ? `<img src="${clgLogoSrc}" alt="Dr. M.G.R. ERI" style="height:52px;filter:brightness(1.3) saturate(1.1);object-fit:contain;" />` : ''}
        ${audiLogoSrc ? `<img src="${audiLogoSrc}" alt="AUDI" style="height:30px;filter:brightness(1.5);opacity:0.9;object-fit:contain;" />` : ''}
        <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
          <div class="sdg-dot-grid">${sdgDots}</div>
          <span style="font-size:0.5rem;color:rgba(255,255,255,0.45);letter-spacing:0.12em;text-transform:uppercase;font-weight:700;margin-top:2px;">SDG Goals</span>
        </div>
      </div>`;

// Insert before footer-bottom
if (!content.includes('class="footer-logos-row"')) {
  content = content.replace(
    '<div class="footer-bottom">',
    footerLogosHTML + '\n      <div class="footer-bottom">'
  );
  console.log('✓ Footer logos HTML injected');
} else {
  console.log('Footer logos already in HTML — skipping');
}

fs.writeFileSync('theoremx_mobile.html', content, 'utf-8');
console.log('✅ Footer logos patch done. Size:', (fs.statSync('theoremx_mobile.html').size/1024/1024).toFixed(2), 'MB');
