import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function loadSwagger(app: Express) {
  const spec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: { title: 'Wanderlust API', version: '1.0.0' },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/**/*.ts'],   // scans JSDoc blocks in every route file
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
}
