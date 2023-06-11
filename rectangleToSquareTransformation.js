(async function () {
  const sharp = require('sharp');
  const path = require('path');

  const imageName = 'blueprint2.jpg';

  let inputImagePath = path.join(__dirname, `/public/input/${imageName}`);
  const outputImagePath = 'image.jpg';
  const paddingSize = 8;
  const borderColor = { r: 0, g: 0, b: 0 }; // Border color (black)

  await sharp(inputImagePath)
    .extend({
      top: paddingSize,
      bottom: paddingSize,
      left: paddingSize,
      right: paddingSize,
      background: borderColor,
    })
    .toFile('imagewithborder.jpg');

  let inputImageWithBorderPath = path.join('imagewithborder.jpg');

  let metadata = await sharp(inputImageWithBorderPath).metadata();
  let fullPixelSize = Math.max(metadata.width, metadata.height);
  const targetSize = fullPixelSize + 100;

  sharp({
    create: {
      width: targetSize,
      height: targetSize,
      channels: 3,
      background: { r: 255, g: 255, b: 255, alpha: 0 }, // Set the background color to black (RGB: 0, 0, 0)
    },
  })
    .composite([
      {
        input: inputImageWithBorderPath,
        gravity: 'centre', // Position the original image at the center of the new image
      },
    ])
    .toFile(outputImagePath)
    .then(() => {
      console.log('Image converted successfully.');
    })
    .catch((err) => {
      console.error('Error converting the image:', err);
    });
})();
