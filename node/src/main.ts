import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import { AppModule } from './app.module';
import * as fs from 'fs'

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(resolve('./certs/localhost-key.pem') ),
    cert: fs.readFileSync(resolve('./certs/localhost.pem'))
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions
  });
  app.enableCors();
  // 配置静态资源
  app.useStaticAssets(join(__dirname, '../../public'), {
    prefix: '/static/', 
    setHeaders: res => {
      res.set('Cache-Control', 'max-age=2592000')
    }
  });

  await app.listen(3000);
  

}
bootstrap();  


