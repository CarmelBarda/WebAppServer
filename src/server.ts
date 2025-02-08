import createServer from './app';
import http, { Server } from 'http';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import fs from 'fs';
import https from 'https';

createServer().then((app) => {
  let port: string;

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Web Advanced Application development 2023 REST API',
        version: '1.0.1',
        description: 'REST server',
      },
      servers: [
        {
          url:
            process.env.NODE_ENV === 'production'
              ? 'https://node125.cs.colman.ac.il'
              : 'http://localhost:' + process.env.PORT,
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };

  const specs = swaggerJsDoc(options);

  app.use('/api', swaggerUI.serve, swaggerUI.setup(specs));

  let server: Server;
  server = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    port = process.env.PORT;
    server = http.createServer(app);
  } else {
    console.log('production');
    port = process.env.HTTPS_PORT;
    const options2 = {
      key: fs.readFileSync('./client-key.pem'),
      cert: fs.readFileSync('./client-cert.pem'),
    };
    server = https.createServer(options2, app);
  }

  server = server
    .listen(port, () => {
      if (process.env.NODE_ENV !== 'production')
        console.log(`Server running on http://localhost:${port}`);
      else console.log(`Server running on http://localhost:${port}`);
    })
    .on('error', (err) => {
      console.error('Error creating HTTPS server:', err.message);
    });
});
