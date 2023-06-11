const express = require('express');
const app = express();
const port = 1370; // Choose the desired port number

app.use(express.static('public/tiles')); // Specify the directory where your images are stored

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/tiles/:zoom/:x/:y.jpg', (req, res) => {
  const imageName = `tiles_${req.params.zoom}-${req.params.x}-${req.params.y}.jpg`;
  res.sendFile(`${__dirname}/public/tiles/blueprint/${imageName}`);
});
