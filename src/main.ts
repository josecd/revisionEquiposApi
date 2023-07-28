import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import *as fs from "fs";
import path from 'path';
import * as  process from "process";
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(__dirname + '/../1/key.pem'),
  //   cert: fs.readFileSync(__dirname + '/../1/cert.pem'),
  // };
  // const app = await NestFactory.create(AppModule, {
  //   httpsOptions,
  // });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'templates'));
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);


  await app.listen(process.env.PORT || 3000);
}
bootstrap();
