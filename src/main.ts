import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors();

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Fuel API')
    .setDescription('API para consulta y refresco de datos de combustible')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Rate limit
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 100,
      handler: (req, res) => {
        res.status(429).json({ message: 'Demasiadas peticiones, intenta más tarde.' });
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();