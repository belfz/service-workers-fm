const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/data', (req, res) => {
  console.log(`got data: ${JSON.stringify(req.body)}`);
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`express server running on port ${PORT}`));
