import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController} from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../utils/logger/logger.module';
import { Category } from './category.entity';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    LoggerModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {
}
