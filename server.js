const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Existing routes and middleware here

app.post('/api/submit-email', (req, res) => {
    console.log('Received email submission request');
    console.log('Email:', req.body.email);
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${email}\n`;

    fs.appendFile('emails.log', logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Email submitted successfully' });
    });
});

// Make sure this catch-all route is at the end
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});