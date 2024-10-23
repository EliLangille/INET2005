const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/webapp', {}).then(() => {
    console.log('Connected to the MongoDB database.');
}).catch(err => {
    console.error('Error connecting to the database:', err);
});

// Create Mongoose schema
const carSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number,
    displacement: Number,
    horsepower: Number
});

// Create car model
const Car = mongoose.model('Car', carSchema, 'cars');

// Define a route to retrieve and display the data
app.get('/', async (req, res) => {
    console.log('Received request to /');
    try {
        const cars = await Car.find();

        // Generate HTML output
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Car Database</title>
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #121212;
                    color: #e0e0e0;
                }
                .container {
                    margin-top: 50px;
                }
                h1 {
                    color: #b71c1c;
                }
                table {
                    background-color: #1e1e1e;
                    color: #e0e0e0;
                }
                table thead {
                    background-color: #b71c1c;
                    color: #ffffff;
                }
                table tbody tr:nth-of-type(odd) {
                    background-color: #2c2c2c;
                }
                table tbody tr:nth-of-type(even) {
                    background-color: #3c3c3c;
                }
                table tbody tr td {
                    color: #e0e0e0;
                }
                .input-group .form-control {
                    background-color: #2c2c2c;
                    color: #e0e0e0;
                    border: 1px solid #444;
                }
                .input-group .btn {
                    background-color: #b71c1c;
                    color: #ffffff;
                    border: 1px solid #b71c1c;
                }
                .input-group .btn:hover {
                    background-color: #a31515;
                    border: 1px solid #a31515;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h1>Car Database</h1>
                <div class="input-group mb-3">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search for cars...">
                    <div class="input-group-append">
                        <button id="searchButton" class="btn btn-primary" type="button">Search</button>
                    </div>
                </div>
                <table class="table table-striped mt-3">
                <thead>
                    <tr>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Displacement (L)</th>
                    <th>Horsepower</th>
                    </tr>
                </thead>
                <tbody id="carTableBody">
                `;

        // Add each row to the HTML table
        cars.forEach(row => {
            html += `
                <tr>
                <td>${row.make}</td>
                <td>${row.model}</td>
                <td>${row.year}</td>
                <td>${row.displacement}</td>
                <td>${row.horsepower}</td>
                </tr>
            `;
        });

        // Add the click listener and search functionality to the HTML table
        html += `
                </tbody>
                </table>
            </div>
            <script>
                document.getElementById('searchButton').addEventListener('click', function() {
                    const filter = document.getElementById('searchInput').value.toLowerCase();
                    const rows = document.querySelectorAll('#carTableBody tr');
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        const match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filter));
                        row.style.display = match ? '' : 'none';
                    });
                });
            </script>
            </body>
            </html>
        `;

        res.send(html);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});