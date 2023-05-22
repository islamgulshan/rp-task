import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../auth';
import { CommonModule } from './../common';
import { AppController } from './app.controller';
import { AppService } from './app.service'; 
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from '../../modules/user'; 
import { CategoryModule } from '../category/category.module'; 
import { CarModule } from '../car/car.module'; 


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        return await AppService.createConnection();
      },
    }),
    ConfigModule.forRoot({
      envFilePath: [AppService.envConfiguration()],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      exclude: ['/api*'],
    }),
    CategoryModule,
    CarModule,
    AuthModule,
    UserModule, 
    CommonModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
