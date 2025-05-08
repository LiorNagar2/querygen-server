import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from '../config/config';
import { INestApplication } from '@nestjs/common';

export function createSwagger(app: INestApplication): void {
  const options = new DocumentBuilder().setTitle('Swagger').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/swagger', app, document);

  app.use('/api/swagger/swagger.json', (req, res, next) => res.send(document));

  // Load your swagger specification
  const apiSpec = JSON.stringify(document);
}

export function printSwaggerDetails(): void {
  console.log(' ');
  console.log('\x1b[36m%s\x1b[0m', '---------- Swagger ----------');
  console.log('\x1b[36m%s\x1b[0m', `Swagger Client`);
  console.log('\x1b[36m%s\x1b[0m', `http://localhost:${config().port}/api/swagger`);
  console.log('\x1b[36m%s\x1b[0m', `Swagger Json`);
  console.log('\x1b[36m%s\x1b[0m', `http://localhost:${config().port}/api/swagger/swagger.json`);
  console.log('');
}
