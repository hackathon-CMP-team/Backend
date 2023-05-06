import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cash Tab')
    .setDescription('This is an e-wallet application')
    .setVersion('1.0')
    .addTag('cash-tab')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });
  await app.listen(3000);
}
bootstrap();
