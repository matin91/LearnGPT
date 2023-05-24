const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5003;

app.use(express.json());
app.use(cors({ origin: 'https://chat.openai.com' }));


app.get('/logo.png', (req, res) => {
  res.sendFile('logo.png', { root: __dirname }, (err) => {
    if (err) res.status(404).send('Not found');
  });
});

app.get('/.well-known/ai-plugin.json', (req, res) => {
  console.log("Trying to load plugin.json");
  const host = req.headers.host;
  fs.readFile('./.well-known/ai-plugin.json', (err, text) => {
    if (err) {
      res.status(404).send('Not found');
    } else {
      text = text.replace('PLUGIN_HOSTNAME', `http://${host}`);
      res.status(200).type('text/json').send(text);
    }
  });
});

app.get('/openapi.yaml', (req, res) => {
  const host = req.headers.host;
  fs.readFile('openapi.yaml', 'utf8', (err, text) => {
    if (err) {
      res.status(404).send('Not found');
    } else {
      text = text.replace('PLUGIN_HOSTNAME', `http://${host}`);
      res.status(200).type('text/yaml').send(text);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
