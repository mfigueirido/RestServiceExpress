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
      _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
      name: { type: 'string', example: 'Paella de marisco' },
      difficulty: {
        type: 'string',
        enum: ['easy', 'medium', 'hard'],
        example: 'medium',
      },
      prepTime: { type: 'number', example: 45 },
      ingredients: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'arroz' },
            quantity: { type: 'string', example: '300g' },
          },
        },
      },
      steps: {
        type: 'array',
        items: { type: 'string' },
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
      author: { type: 'string', example: 'user123' },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:30:00.000Z',
      },
      ratings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            userId: { type: 'string', example: 'user456' },
            score: { type: 'number', example: 5 },
            comment: { type: 'string', example: 'Excelente!' },
          },
        },
      },
    },
  },
  CreateRecipeRequest: {
    type: 'object',
    required: ['name', 'prepTime', 'ingredients', 'steps', 'author'],
    properties: {
      name: { type: 'string' },
      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
      prepTime: { type: 'number' },
      ingredients: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            quantity: { type: 'string' },
          },
        },
      },
      steps: { type: 'array', items: { type: 'string' } },
      tags: { type: 'array', items: { type: 'string' } },
      author: { type: 'string' },
    },
  },
};

module.exports = swaggerJsdoc(options);
