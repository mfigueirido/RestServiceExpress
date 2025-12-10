const express = require('express');

const app = express();

app.get('/', (req, res) => res.json({ message: 'Simple REST API using Express.js' }));

module.exports = app;
