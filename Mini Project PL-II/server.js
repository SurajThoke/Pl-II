const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/login'; // MongoDB URI for the 'login' database

// Middleware for parsing JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        const db = client.db();

        // Route for handling login POST requests
        app.post('/login', (req, res) => {
            const { username, password } = req.body;
            console.log('Username:', username);
            console.log('Password:', password);

            // Insert username and password into MongoDB collection
            db.collection('users').insertOne({
                username,
                password,
                createdAt: new Date()
            })
            .then(result => {
                console.log('Username and password inserted successfully');
                res.json({ success: true, message: 'Username and password inserted successfully' });
            })
            .catch(err => {
                console.error('Error inserting username and password:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            });
        });

        // Serve the HTML file
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });
