const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gateway.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-email', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp}: ${email}\n`;

        await fs.appendFile('emails.log', logEntry);
        res.json({ message: 'Email submitted successfully' });
    } catch (err) {
        console.error('Error in /submit-email:', err);
        res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
});

app.get('/view-logs', async (req, res) => {
    try {
        const data = await fs.readFile('emails.log', 'utf8');
        res.type('text').send(data);
    } catch (err) {
        console.error('Error reading log file:', err);
        res.status(500).send('Error reading log file: ' + err.message);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});