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
    // Log with a specific prefix for easy filtering
    console.log(`SUBMITTED_EMAIL: ${timestamp}: ${email}`);
    
    res.json({ message: 'Email submitted successfully' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gateway.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});