import { BadRequestException, HttpException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hash } from '../../utils/Hash';
import { RegisterPayload } from './../auth/register.payload';
import { In, Repository } from 'typeorm';
import { ResponseCode, ResponseMessage } from '../../utils/enum';
import { User, UserFillableFields } from './user.entity';
import { AdminDTO } from './commons/user.dtos';
import { StaffDto } from './commons/staff.dto';
import speakeasy from 'speakeasy';
import { MailService } from '../../utils/mailer/mail.service';
import { RolePermissionDto } from './commons/role_permission.dto';
import { isPositiveInteger } from '../../utils/methods';
import path, { extname } from 'path';
import { generateKey, generateToken, generateTotpUri, verifyToken } from 'authenticator';
import { isUUID } from 'class-validator';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerservice: MailService,
    
  ) {
  }

 
  async get(uuid: string) {
    return this.userRepository.findOne({ uuid });
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  
  async create(payload: UserFillableFields) {
    const user = await this.getByEmail(payload.email);
    if (user) {
      throw new NotAcceptableException(
        `User with provided email already created.`,
      );
    }
    return await this.userRepository.save(payload);
  }

  /**
   * Create a genesis user
   * @param payload
   * @returns
   */
  async createAdmin(payload: RegisterPayload): Promise<any> {
    const user = await this.getByEmail(payload.email);
     
    if (user) {
      throw new HttpException(
        ResponseMessage.USER_ALREADY_EXISTS,
        ResponseCode.BAD_REQUEST,
      );
    }
    const newUser = new User().fromDto(payload);
    const passwordLength = 8; // Length of the password you want to generate
    const randomPassword = this.generateRandomPassword(passwordLength);
    newUser.password = await Hash.make(randomPassword);
    await this.userRepository.save(newUser); 
    //await this.mailerservice.sendEmailPassword(newUser,randomPassword)
    return randomPassword;
  }

  public generateRandomPassword(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
  
    return password;
  }

  /**
   * Forget password confirmation
   * @param email
   * @param password
   * @returns
   */
  public async confirmForgotPassword(email: string, password: string) {
    const user: User = await this.userRepository.findOne({ email });
    if (user) {
      const passwordHash = await Hash.make(password);
      await this.userRepository.update({ email }, { password: passwordHash });
      return user;
    } else {
      throw new HttpException(
        ResponseMessage.USER_DOES_NOT_EXIST,
        ResponseCode.NOT_FOUND,
      );
    }
  }

   
 
}
