const express = require('express');
const app = express();

const requestId = require('./middleware/requestId');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const dbReady = require('./middleware/dbReady');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

// Attach a request id to every incoming request for easier tracing
app.use(requestId);

// Logging middleware
app.use(morgan('dev'));

// Security middlewares
app.use(helmet());
app.use(cors());

// Body parser middleware
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Routes
app.use('/api/auth', dbReady, authRoutes);
app.use('/api/recipes', dbReady, auth, recipeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => res.json({ message: 'Simple REST API using Express.js' }));

app.use(errorHandler);

module.exports = app;
