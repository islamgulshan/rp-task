import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { LoggerService } from '../../utils/logger/logger.service';

@Controller('api/admin')
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('UserController');
  }  
 
}
