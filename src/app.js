const express = require('express');
const app = express();

const dbReady = require('./middleware/dbReady');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

app.use(express.json());

app.use('/api/auth', dbReady, authRoutes);

app.use('/api/recipes', dbReady, recipeRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.json({ message: 'Simple REST API using Express.js' }));

module.exports = app;
