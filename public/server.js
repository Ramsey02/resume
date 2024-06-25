const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key', // Replace with a strong, random string
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware to check if user has submitted email
const requireEmail = (req, res, next) => {
  if (req.session.userEmail) {
    next();
  } else {
    res.redirect('/gateway');
  }
};

app.get('/', requireEmail, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/gateway', (req, res) => {
  if (req.session.userEmail) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'gateway.html'));
  }
});

// Ensure this endpoint is correctly defined
app.post('/submit-email', async (req, res) => {
  console.log('Received email submission request'); // Add this line for debugging
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${email}\n`;

    await fs.appendFile('emails.log', logEntry);
    req.session.userEmail = email;
    res.json({ message: 'Email submitted successfully' });
  } catch (err) {
    console.error('Error in /submit-email:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

app.use(express.static('public'));

// Add this catch-all route at the end
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});