const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Serve gateway.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gateway.html'));
});

// Explicit route for index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${email}\n`;

    try {
        await fs.appendFile('emails.log', logEntry);
        res.json({ message: 'Email submitted successfully' });
    } catch (err) {
        console.error('Error writing to log file:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to view logs (protect this in production!)
app.get('/view-logs', async (req, res) => {
    try {
        const data = await fs.readFile('emails.log', 'utf8');
        res.type('text').send(data);
    } catch (err) {
        console.error('Error reading log file:', err);
        res.status(500).send('Error reading log file');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});