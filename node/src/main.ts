import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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


