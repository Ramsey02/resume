const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/submit-email', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${email}`;

    // Instead of writing to a file, log to console
    console.log(logEntry);
    
    // In a real-world scenario, you might want to use a database or external logging service here

    res.json({ message: 'Email submitted successfully' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gateway.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});