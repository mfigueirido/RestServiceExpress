const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'REST Service API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

// Extend components with common schemas
options.definition.components.schemas = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
    },
  },
  RegisterRequest: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  AuthResponse: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      user: { $ref: '#/components/schemas/User' },
    },
  },
  Recipe: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '507f1f77bcf86cd799439011' },
      name: { type: 'string', example: 'Potato omelet' },
      difficulty: {
        type: 'string',
        enum: ['easy', 'medium', 'hard'],
        example: 'medium',
      },
      prepTime: { type: 'number', example: 30, default: 1 },
      ingredients: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Potato' },
            quantity: { type: 'string', example: '500g' },
          },
        },
      },
      steps: {
        type: 'array',
        items: { type: 'string', example: 'Fry potatoes' },
      },
      tags: {
        type: 'array',
        items: { type: 'string', example: 'European dishes' },
      },
      author: { type: 'string', example: 'user123' },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z',
      },
      ratings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            userId: { type: 'string', example: 'user123' },
            score: { type: 'number', example: 5 },
            comment: { type: 'string', example: 'Excellent!' },
          },
        },
      },
    },
  },
  RecipeRequest: {
    type: 'object',
    required: ['name', 'prepTime', 'ingredients', 'steps', 'author'],
    properties: {
      name: { type: 'string', example: 'Potato omelet' },
      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'], example: 'medium' },
      prepTime: { type: 'number', example: 30, default: 1 },
      ingredients: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Potato' },
            quantity: { type: 'string', example: '500g' },
          },
        },
      },
      steps: { type: 'array', items: { type: 'string', example: 'Fry potatoes' } },
      tags: { type: 'array', items: { type: 'string', example: 'European dishes' } },
      author: { type: 'string', example: 'user123' },
    },
  },
  RatingRequest: {
    type: 'object',
    required: ['userId', 'score'],
    properties: {
      score: { type: 'number', minimum: 1, maximum: 5 },
      comment: { type: 'string', maxLength: 500 },
    },
  },
};

module.exports = swaggerJsdoc(options);
