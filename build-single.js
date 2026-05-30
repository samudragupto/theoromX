const fs = require('fs');

try {
  let html = fs.readFileSync('index.html', 'utf8');
  const css = fs.readFileSync('style.css', 'utf8');
  const js = fs.readFileSync('script.js', 'utf8');

  // Inline CSS
  html = html.replace('<link rel="stylesheet" href="style.css" />', `<style>\n${css}\n</style>`);
  
  // Inline JS
  html = html.replace('<script src="script.js"></script>', `<script>\n${js}\n</script>`);

  // Base64 Images
  const clgLogo = fs.readFileSync('clg-logo-BcHbAi1G.png', 'base64');
  const audiLogo = fs.readFileSync('audi logo-VGoDBqTU.png', 'base64');
  const whatsappImage = fs.readFileSync('WhatsApp Image 2026-05-28 at 1.18.57 PM.jpeg', 'base64');
  const posterImg = fs.readFileSync('poster.png', 'base64');
  const hodImg = fs.readFileSync('hod.png', 'base64');
  const ushaImg = fs.readFileSync('usha.jpeg', 'base64');

  html = html.replaceAll('src="clg-logo-BcHbAi1G.png"', `src="data:image/png;base64,${clgLogo}"`);
  html = html.replaceAll('src="audi%20logo-VGoDBqTU.png"', `src="data:image/png;base64,${audiLogo}"`);
  html = html.replaceAll('src="audi logo-VGoDBqTU.png"', `src="data:image/png;base64,${audiLogo}"`);
  html = html.replaceAll('src="WhatsApp Image 2026-05-28 at 1.18.57 PM.jpeg"', `src="data:image/jpeg;base64,${whatsappImage}"`);
  html = html.replaceAll('src="poster.png"', `src="data:image/png;base64,${posterImg}"`);
  html = html.replaceAll('src="hod.png"', `src="data:image/png;base64,${hodImg}"`);
  html = html.replaceAll('src="usha.jpeg"', `src="data:image/jpeg;base64,${ushaImg}"`);

  fs.writeFileSync('theoremx_mobile.html', html);
  console.log('Successfully created theoremx_mobile.html');
} catch (error) {
  console.error('Error creating single file:', error);
}
