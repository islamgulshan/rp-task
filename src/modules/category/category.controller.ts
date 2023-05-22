import { CategoryService } from './category.service';
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
import { CategoryDto } from './commons/category.dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Pagination } from '../../utils/paginate';
import { User } from '../user';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { isPositiveInteger } from '../../utils/methods'; 

@Controller('api/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('TeamsController');
  }

  @Get('categories_list')
  @UseGuards(AuthGuard('jwt'))
  public async categoryList(
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.loggerService.log(
      `GET teams /teams_list ${LoggerMessages.API_CALLED}`,
    );
    const pagination: IPaginationOptions = await Pagination.paginate(req, res);
    const categoriesList = await this.categoryService.teamsList(query, pagination);
    return res.status(ResponseCode.SUCCESS).send({
      statusCode: ResponseCode.SUCCESS,
      message: ResponseMessage.SUCCESS,
      data: categoriesList,
    });
  }
 

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  public async categoryAdd(
    @Body() payload: CategoryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.loggerService.log(`POST category /add ${LoggerMessages.API_CALLED}`);
    const category = await this.categoryService.CategoryAdd(
      payload
    );
    return res.status(ResponseCode.CREATED_SUCCESSFULLY).send({
      statusCode: ResponseCode.CREATED_SUCCESSFULLY,
      message: ResponseMessage.CREATED_SUCCESSFULLY,
      data: category,
    });
  }

  @Patch(':id')
  public async categoryEdit(
    @Body() payload: CategoryDto,
    @Res() res: Response, 
    @Param('id') categoryId: number,

  ) {
    this.loggerService.log(`PATCH category /:id ${LoggerMessages.API_CALLED}`);
    const isPosInt = isPositiveInteger(categoryId.toString());
    if (!isPosInt)
      throw new HttpException(
        `Parameter id ${ResponseMessage.IS_INVALID}`,
        ResponseCode.BAD_REQUEST,
      );
    const member = await this.categoryService.categoryEdit(
      payload, 
      categoryId,
    );
    return res.status(ResponseCode.SUCCESS).send({
      statusCode: ResponseCode.SUCCESS,
      message: ResponseMessage.SUCCESS,
      data: member,
    });
  }


  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  public async CategoryDetail(
    @Param('id') teamId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.loggerService.log(`GET Category /:id ${LoggerMessages.API_CALLED}`);
    const teamMember = await this.categoryService.categoryDetail(teamId);
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
    @Param('id') categoryId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.loggerService.log(`GET Teams /:id ${LoggerMessages.API_CALLED}`);
    const teamMember = await this.categoryService.categoryDelete(categoryId);
    return res.status(ResponseCode.SUCCESS).send({
      statusCode: ResponseCode.SUCCESS,
      message: ResponseMessage.SUCCESS,
      data: {
        ...teamMember
      },
    });
  }

  
}
