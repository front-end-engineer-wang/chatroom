import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}
