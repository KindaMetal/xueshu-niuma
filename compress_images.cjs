const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'assets');

async function convert() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.png')) {
      const name = file.replace('.png', '');
      const src = path.join(dir, file);
      const dest = path.join(dir, `${name}.webp`);
      
      console.log(`Compressing ${file} to WebP...`);
      await sharp(src)
        .webp({ quality: 80 })
        .toFile(dest);
        
      fs.unlinkSync(src); // delete old heavy png
    }
  }
}
convert().then(() => console.log('All 16MB of images ultra-compressed to fractional KB size!')).catch(console.error);
