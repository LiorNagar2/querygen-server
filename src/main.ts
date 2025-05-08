import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSwagger, printSwaggerDetails } from './helpers/swaggerHelper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  createSwagger(app);
  printSwaggerDetails();

  app.enableCors();

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
