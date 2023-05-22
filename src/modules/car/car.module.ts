import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController} from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../utils/logger/logger.module';
import { Car } from './car.entity';
import { Category } from 'modules/category/category.entity';
import { CategoryModule } from '../../modules/category/category.module';
import { CategoryService } from 'modules/category/category.service';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Car,Category]),
    LoggerModule,
    
  ],
  controllers: [CarController],
  providers: [CarService,CategoryService],
})
export class CarModule {
}
