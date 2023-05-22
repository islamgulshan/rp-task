import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, getManager, IsNull, Not, Repository } from 'typeorm';
import { Car } from './car.entity';
import { CarDto } from './commons/car.dtos';
import { ResponseCode, ResponseMessage } from '../../utils/enum';
import path, { extname } from 'path';
import { isPositiveInteger } from '../../utils/methods';
import * as fs from 'fs';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CategoryService } from 'modules/category/category.service';

@Injectable()
export class CarService {
  constructor(
    private readonly categoryRepostory: CategoryService,
    @InjectRepository(Car)
    private readonly CarRepository: Repository<Car>,
    
  ) {
  }

  /**
   * Category  List
   * @param query
   * @returns teams with pagination
   */
  public async carList(query: any, paginationOption: IPaginationOptions) {
    const limit = Number(paginationOption.limit);
    const page = Number(paginationOption.page);
    let cars = [];
    let total_car = 0;
    let filter = ``;
    if (query.search) {
      filter += ` 
                  ( c."name" like '%${query.search}%'
                  )`;
    }
    cars = await this.CarRepository.find({
      where:
        filter
      ,
      take: limit,
      skip: limit * (page - 1)
    });
    total_car = await this.CarRepository.count({
      where:
        filter

    });
    if (!cars.length) {
      throw new HttpException(
        ResponseMessage.CONTENT_NOT_FOUND,
        ResponseCode.CONTENT_NOT_FOUND,
      );
    }
    return {
      cars,
      totalCars: total_car,
    };
  }

  public async teamListAggregate(paginationOption: IPaginationOptions) {
    const condition = { exit_date: IsNull() };
    return await this.paginate(paginationOption, condition);
  }

  /**
   * Add category Api
   * @param payload
   * @returns category
   */
  public async CarAdd(
    payload: CarDto,
  ): Promise<Car> {

    const newCategory = new Car().fromDto(payload);
    const categoryExist = await this.categoryRepostory.findOne({  categoryId: payload.category_id, });   
    if (!categoryExist) {    
      throw new HttpException(
        `Category  ${ResponseMessage.DOES_NOT_EXIST}`,
        ResponseCode.NOT_FOUND,
      );

    }       
    const category = await this.CarRepository.save(newCategory);
    return category;
  }

  /**
   * Category memeber Detail Api
   * @param carId
   * @returns CategoryMember
   */
  public async carDetail(id: number): Promise<Car> {
    const validateInt = isPositiveInteger(id.toString());
    if (!validateInt) {
      throw new HttpException(
        `Query Param id ${ResponseMessage.IS_INVALID}`,
        ResponseCode.BAD_REQUEST,
      );
    }
    const car = await this.CarRepository.findOne(id);
    if (!car) {
      throw new HttpException(
        `Car  ${ResponseMessage.DOES_NOT_EXIST}`,
        ResponseCode.NOT_FOUND,
      );
    }
    return car;
  }

  /**
   * Edit Category member Api
   * @param payload
   * @returns Category
   */
  public async carEdit(
    payload: CarDto,
    carId: number,
  ) {
    const carExist = await this.CarRepository.findOne(carId);
    if (!carExist) {
      throw new HttpException(
        `Car  ${ResponseMessage.DOES_NOT_EXIST}`,
        ResponseCode.NOT_FOUND,
      );
    }
    const categoryExist = await this.categoryRepostory.findOne({ categoryId: payload.category_id, });
    if (!categoryExist) {
      throw new HttpException(
        `Category  ${ResponseMessage.DOES_NOT_EXIST}`,
        ResponseCode.NOT_FOUND,
      );
    }

    const duplicate = await this.CarRepository.findOne({
      carId: Not(carId),
    });
    if (duplicate) {
      throw new HttpException(
        `Car ${ResponseMessage.CATEGORY_ALREADY_EXIST}`,
        ResponseCode.BAD_REQUEST,
      );
    }
    const categoryEdit = new Car().fromDto(payload);
    return await this.CarRepository.update({ carId }, categoryEdit);
  }

  /**
  * Delete Category Api
  * @param carId
  * @returns
  * 
  *  */
  public async carDelete(carId: number) {
    const categoryExist = await this.CarRepository.findOne(carId);
    if (!categoryExist) {
      throw new HttpException(
        `Category ${ResponseMessage.DOES_NOT_EXIST}`,
        ResponseCode.NOT_FOUND,
      );
    }
    return await this.CarRepository.delete({ carId });
  }


  /**
   * Paginate Category list
   * @param options
   * @param condition
   * @param relations
   * @returns
   */
  private async paginate(
    options: IPaginationOptions,
    condition?: Object,
  ): Promise<Pagination<Car>> {
    return paginate<Car>(this.CarRepository, options, {
      where: condition,
    });
  }


}
