import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import *as fs from "fs";
async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/cert.key'),
    cert: fs.readFileSync('./secrets/cert.crt'),
  };
  // const app = await NestFactory.create(AppModule, {
  //   httpsOptions,
  // });
  
  const app = await NestFactory.create(AppModule, { httpsOptions ,cors:true });
  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('swagger', app, document);



  await app.listen(8080,'172.30.121.102');
}
bootstrap();
