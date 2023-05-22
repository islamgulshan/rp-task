import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService, LoginPayload, RegisterPayload } from './';
import { LoggerService } from '../../utils/logger/logger.service';
import { LoggerMessages, ResponseCode, ResponseMessage } from '../../utils/enum';
import { Request, Response } from 'express';


@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('AuthController');
  }

  @Post('register')
  async createAdmin(
    @Body() payload: RegisterPayload,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.authService.registerAdmin(payload);
    return res.status(ResponseCode.CREATED_SUCCESSFULLY).send({
      statusCode: ResponseCode.CREATED_SUCCESSFULLY,
      data: user,
      message: ResponseMessage.CREATED_SUCCESSFULLY,
    });
  }

  @Post('login')
  async login(@Body() payload: LoginPayload): Promise<any> {
    this.loggerService.log(`POST auth/login ${LoggerMessages.API_CALLED}`);
    const user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }
}
