const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the views/messages directory exists
const messagesDir = path.join(__dirname, 'views/messages');
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir);
}

// Route to display the form and list of messages
app.get('/', (req, res) => {
  const files = fs.readdirSync(messagesDir);
  const messages = files.map(file => {
    const url = path.basename(file, '.json');
    const filePath = path.join(messagesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8')).content;
    return { url, content };
  });
  res.render('form', { messages });
});

// Route to handle form submissions
app.post('/messages', (req, res) => {
  const { content } = req.body;
  const url = Math.random().toString(36).substr(2, 9);
  const filePath = path.join(messagesDir, `${url}.json`);
  
  fs.writeFileSync(filePath, JSON.stringify({ content }));
  
  res.redirect(`/messages/${url}`);
});

// Route to display the message
app.get('/messages/:url', (req, res) => {
  const { url } = req.params;
  const filePath = path.join(messagesDir, `${url}.json`);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Message not found');
  }
  
  const message = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.render('message', { content: message.content, url });
});

// Route to delete the message
app.post('/messages/:url/delete', (req, res) => {
  const { url } = req.params;
  const filePath = path.join(messagesDir, `${url}.json`);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Message not found');
  }
  
  fs.unlinkSync(filePath);
  res.redirect('/');
});

// Set up view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
  console.log(`Message service running at http://localhost:${port}`);
});
