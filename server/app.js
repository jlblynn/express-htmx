import express from 'express';
import request from 'request';
import chalk from 'chalk';
import opn from 'opn';
import { fileURLToPath } from 'url';
import path from 'path';

import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const app = express();

const funTranslationsApiUrl = 'https://api.funtranslations.com/translate/';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "client" directory
app.use(express.static(path.join(__dirname, 'client', 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'client', 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.get('/js/htmx/htmx.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'public', 'js', 'htmx', 'htmx.min.js'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'templates', 'index.html'));
});

app.post('/translate', (req, res) => {
  const text = DOMPurify.sanitize(req.body.text); // Sanitize the user input
  const language = req.body.language;

  const options = {
    url: `${funTranslationsApiUrl}${language}.json`,
    form: { text: text }
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(body);
      if (json.success && json.contents && json.contents.translated) {
        const translation = json.contents.translated;
        res.send(translation);
      } else {
        console.error('Invalid JSON response:', body);
        res.sendStatus(500);
      }
    }
  });
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`Server listening on ${chalk.yellow(url)}`);
  opn(url);
});