const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crypto exchange server API',
      version: '1.0.0',
      description:
        'Crypto exchange API finds the most efficient paths for a token swap, able to split between different protocols and even different market depths in within one protocol in the shortest possible time. Using Crypto exchange API, you can find the best route to exchange assets and make the exchange.',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: ['index.js'],
};
const specs = swaggerJsdoc(options);
module.exports = {
  specs,
  swaggerUi,
};
