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
  SwaggerModule.setup('ahmed', app, document);
  app.setGlobalPrefix('ahmed');
  await app.listen(3000);
}
bootstrap();
