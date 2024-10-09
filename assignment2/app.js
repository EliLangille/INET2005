const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpassword', 
    database: 'webapp',
    port: 3307
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL: ' + err);
        return;
    }
    console.log('MySQL Connected...');
});

// Endpoint to retrieve data from MySQL and display it
app.get('/', (req, res) => {
    let sql = 'SELECT * FROM Cars';
    db.query(sql, (err, results) => {
        if (err) {
            console.log('Error fetching data from MySQL: ' + err);
            return;
        }
        
        // Construct HTML to display data in table
        // Minor table styling is done inline for simplicity
        let html = `
            <html>
                <head>
                    <title>Cars Database</title>
                    <style>
                        th {
                            padding: 4px;
                            background-color: #f2f2f2;
                        }
                        td {
                            padding: 4px 8px 4px 4px;
                        }
                        th.year {
                            padding-left: 8px;
                            padding-right: 8px;
                        }
                        td.year {
                            padding-right: 12px;
                        }
                        body {
                            font-family: Calibri, sans-serif;
                        }
                    </style>
                </head>
                <body>
                    <h1>Cars Database</h1>
                    <table border="1">
                        <tr>
                            <th>ID</th>
                            <th>Make</th>
                            <th>Model</th>
                            <th class="year">Year</th>
                            <th>Displacement (L)</th>
                            <th>Horsepower (hp)</th>
                        </tr>`;
        
        // Loop through the results and append rows to the HTML table
        results.forEach((car) => {
            html += `
                <tr>
                    <td>${car.id}</td>
                    <td>${car.make}</td>
                    <td>${car.model}</td>
                    <td class="year">${car.year}</td>
                    <td>${car.displacement}</td>
                    <td>${car.horsepower}</td>
                </tr>`;
        });

        // Close the HTML tags
        html += `
                    </table>
                </body>
            </html>`;

        // Send the constructed HTML back to the client
        res.send(html);
    });
});

// Start the server
app.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});
