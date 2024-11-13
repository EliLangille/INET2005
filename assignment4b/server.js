const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // parse form submissions

// Serve the web page at the root URL
app.use(express.static('public'));

// Handle POST requests to /api/trivia
app.post('/api/trivia', async (req, res) => {
    const prompt = req.body.prompt;

    // Call the OpenAI API
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Grab key from .env
                'Content-Type': 'application/json',
            },
        });

        // Send the response from the OpenAI API back to the client
        res.send(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error.response ? error.response.data : error.message);
        res.status(500).send('Error communicating with OpenAI API');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});