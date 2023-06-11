(async function () {
  const sharp = require('sharp');
  const path = require('path');

  const imageName = 'blueprint-transformed.jpg';
  let input = path.join(__dirname, `public/input/${imageName}`); // <-- this is your input image

  let metadata = await sharp(input).metadata();
  let fullPixelSize = Math.max(metadata.width, metadata.height);

  await sharp(input)
    .resize(fullPixelSize, fullPixelSize)
    .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile('squarified.jpg');

  console.log('squarified ✓');

  //sharp.cache(false);

  let zoom = 0;
  while (true) {
    // double size for each consecutive zoom level, starting at 256px:
    let pixelSize = 256 * 2 ** zoom;

    // if (pixelSize > fullPixelSize ) {
    //   zoom--;
    //   break;
    // }
    if (zoom > 7) {
      zoom--;
      break;
    }

    console.log(`Processing zoom level ${zoom}...`);

    await sharp('squarified.jpg')
      .resize(pixelSize, pixelSize)
      .toFile(`resized-${zoom}.jpg`);

    let rows = 2 ** zoom;
    let cols = 2 ** zoom;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        await sharp(`resized-${zoom}.jpg`, { limitInputPixels: 32000 * 32000 })
          .extract({ left: col * 256, top: row * 256, width: 256, height: 256 })
          .toFile(`./output/blueprint/tiles_${zoom}-${col}-${row}.jpg`);
      }
    }

    zoom++;
  }

  if (zoom < 0) {
    console.error(
      `Seems that you've input an image that's less than 256 pixels`
    );
  } else {
    console.log(`Finished at zoom=${zoom}`);
  }
})();
