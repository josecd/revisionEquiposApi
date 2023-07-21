import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import *as fs from "fs";
import path from 'path';
import * as  process from "process";

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(__dirname + '/../1/key.pem'),
  //   cert: fs.readFileSync(__dirname + '/../1/cert.pem'),
  // };
  // const app = await NestFactory.create(AppModule, {
  //   httpsOptions,
  // });
 
  
  const app = await NestFactory.create(AppModule, {  cors:true });
  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
