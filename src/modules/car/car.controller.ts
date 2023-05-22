import { CarService } from './car.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerMessages, ResponseCode, ResponseMessage } from '../../utils/enum';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from '../../utils/logger/logger.service';
import { CarDto } from './commons/car.dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Pagination } from '../../utils/paginate';
import { User } from '../user';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { isPositiveInteger } from '../../utils/methods'; 

@Controller('api/car')
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('TeamsController');
  }

  @Get('cars_list')
  @UseGuards(AuthGuard('jwt'))
  public async carList(
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.loggerService.log(
      `GET teams /teams_list ${LoggerMessages.API_CALLED}`,
    );
    const pagination: IPaginationOptions = await Pagination.paginate(req, res);
    const carsList = await this.carService.carList(query, pagination);
    return res.status(ResponseCode.SUCCESS).send({
      statusCode: ResponseCode.SUCCESS,
      message: ResponseMessage.SUCCESS,
      data: carsList,
    });
  }
 

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  public async carAdd(
    @Body() payload: CarDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.loggerService.log(`POST car /add ${LoggerMessages.API_CALLED}`);
    const car = await this.carService.CarAdd(
      payload
    );
    return res.status(ResponseCode.CREATED_SUCCESSFULLY).send({
      statusCode: ResponseCode.CREATED_SUCCESSFULLY,
      message: ResponseMessage.CREATED_SUCCESSFULLY,
      data: car,
    });
  }

  @Patch(':id')
  public async carEdit(
    @Body() payload: CarDto,
    @Res() res: Response, 
    @Param('id') carId: number,

  ) {
    this.loggerService.log(`PATCH car /:id ${LoggerMessages.API_CALLED}`);
    const isPosInt = isPositiveInteger(carId.toString());
    if (!isPosInt)
      throw new HttpException(
        `Parameter id ${ResponseMessage.IS_INVALID}`,
        ResponseCode.BAD_REQUEST,
      );
    const member = await this.carService.carEdit(
      payload, 
      carId,
    );
    return res.status(ResponseCode.SUCCESS).send({
      statusCode: ResponseCode.SUCCESS,
      message: ResponseMessage.SUCCESS,
      data: member,
    });
  }


  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  public async CarDetail(
    @Param('id') teamId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.loggerService.log(`GET Car /:id ${LoggerMessages.API_CALLED}`);
    const teamMember = await this.carService.carDetail(teamId);
    return res.status(ResponseCode.SUCCESS).send({
      statusCode: ResponseCode.SUCCESS,
      message: ResponseMessage.SUCCESS,
      data: {
        ...teamMember
      },
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  public async catDelete(
    @Param('id') carId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.loggerService.log(`GET Teams /:id ${LoggerMessages.API_CALLED}`);
    const teamMember = await this.carService.carDelete(carId);
    return res.status(ResponseCode.SUCCESS).send({
      statusCode: ResponseCode.SUCCESS,
      message: ResponseMessage.SUCCESS,
      data: {
        ...teamMember
      },
    });
  }

  
}
