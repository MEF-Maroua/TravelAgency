const fs = require('fs');
const path = require('path');

const images = [
  'Alger.jpg', 'oran.jpg', 'setif.jpg', 'Annaba.jpg', 'Skikda.jpg', 
  'Constantine.jpg', 'tamanrasset.jpg', 'Blida.jpg',
  'gallery-01.jpg', 'gallery-02.jpg', 'gallery-03.jpg', 'gallery-04.jpg', 
  'gallery-05.jpg', 'gallery-06.jpg', 'gallery-07.jpg', 'gallery-08.jpg',
  'ava-1.jpg', 'ava-2.jpg', 'ava-3.jpg', 'ava-4.jpg',
  'hero-img01.jpg', 'hero-img02.jpg', 'hero-img03.jpg',
  'experience.png', 'login.png', 'user.png', 'avatar.jpg',
  'weather.png', 'guide.png', 'customization.png', 'map.jpg', 
  'male-tourist.png', 'tour.jpg'
];

// A 1x1 transparent PNG base64
const transparentPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const buffer = Buffer.from(transparentPngBase64, 'base64');

const dir = path.join(__dirname, 'src/assets/images');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

images.forEach(img => {
  const imgPath = path.join(dir, img);
  if (!fs.existsSync(imgPath)) {
    fs.writeFileSync(imgPath, buffer);
    console.log('Created missing image:', img);
  }
});
