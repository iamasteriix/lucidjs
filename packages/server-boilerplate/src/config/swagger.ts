import swaggerJSDoc from 'swagger-jsdoc';


export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lucid — Server API template',
      version: '0.1.0',
    },
  },
  apis: [
    'src/app/**/*.docs.yml',
  ],
});
