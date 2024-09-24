const express = require('express');
const fs = require('fs');
const path = require('path'); // Import the path module to resolve file paths
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

// Test endpoint
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Endpoint to serve the budget data
app.get('/budget', (req, res) => {  // Correct the route to /budget
    // Use path.join to form the correct file path to budget.json
    const budgetFilePath = path.join(__dirname, 'budget.json'); // Points to budget.json in the same folder

    // Read the budget.json file
    fs.readFile(budgetFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading budget.json:', err);
            res.status(500).send('Server Error');
            return;
        }
        // Send the JSON data as a response
        res.json(JSON.parse(data));
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
