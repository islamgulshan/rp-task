import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, getManager, IsNull, Not, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDto } from './commons/category.dtos';
import { ResponseCode, ResponseMessage } from '../../utils/enum';
import path, { extname } from 'path';
import { isPositiveInteger } from '../../utils/methods';
import * as fs from 'fs';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly CategoryRepository: Repository<Category>,
  ) {
  } 

  /**
   * Category  List
   * @param query
   * @returns teams with pagination
   */
  public async teamsList(query: any, paginationOption: IPaginationOptions) {
    const limit = Number(paginationOption.limit);
    const page = Number(paginationOption.page);
    let filter = `where 1=1`;
    if (query.search) {
      filter += ` AND  
                  ( c."name" like '%${query.search}%'
                  )`;
    }
    const sql = `SELECT 
                  c."name"
                FROM 
                categories c
                  ${filter} 
                ORDER BY c."categoryId" DESC LIMIT $1 OFFSET $2`;
    const categories = await getManager().query(sql, [limit, limit * (page - 1)]);
    const total_sql = `SELECT  
                        COUNT(*) as total_categories 
                      FROM 
                      categories 
                        ${filter}`;
    const totalCategories = await getManager().query(total_sql);
    if (!categories.length) {
      throw new HttpException(
        ResponseMessage.CONTENT_NOT_FOUND,
        ResponseCode.CONTENT_NOT_FOUND,
      );
    }
    return {
      categories,
      totalCategories: Number(totalCategories[0].total_categories),
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
  public async CategoryAdd(
    payload: CategoryDto, 
  ): Promise<Category> {
    
    const newCategory = new Category().fromDto(payload);
    const categoryExist = await this.CategoryRepository.findOne({
      name: payload.name,
    });
    if (categoryExist) {
      throw new HttpException(
        ResponseMessage.CATEGORY_ALREADY_EXIST,
        ResponseCode.BAD_REQUEST,
      );
    }
    const category = await this.CategoryRepository.save(newCategory);
    return category;
  }

  /**
   * Category memeber Detail Api
   * @param CategoryId
   * @returns CategoryMember
   */
  public async categoryDetail(id: number): Promise<Category> {
    const validateInt = isPositiveInteger(id.toString());
    if (!validateInt) {
      throw new HttpException(
        `Query Param id ${ResponseMessage.IS_INVALID}`,
        ResponseCode.BAD_REQUEST,
      );
    }
    const teamMember = await this.CategoryRepository.findOne(id);
    if (!teamMember) {
      throw new HttpException(
        `Team member ${ResponseMessage.DOES_NOT_EXIST}`,
        ResponseCode.NOT_FOUND,
      );
    }
    return teamMember;
  }

  /**
   * Edit Category member Api
   * @param payload
   * @returns Category
   */
  public async categoryEdit(
    payload: CategoryDto,
    categoryId: number,
  ) {
    const categoryExist = await this.CategoryRepository.findOne(categoryId);
    if (!categoryExist) {
      throw new HttpException(
        `Category  ${ResponseMessage.DOES_NOT_EXIST}`,
        ResponseCode.NOT_FOUND,
      );
    }
    const duplicate = await this.CategoryRepository.findOne({
      categoryId: Not(categoryId), 
    });
    if (duplicate) {
      throw new HttpException(
        `category ${ResponseMessage.CATEGORY_ALREADY_EXIST}`,
        ResponseCode.BAD_REQUEST,
      );
    } 
    const categoryEdit = new Category().fromDto(payload);
    return await this.CategoryRepository.update({ categoryId }, categoryEdit);
  }

   /**
   * Delete Category Api
   * @param categoryId
   * @returns
   * 
   *  */
   public async categoryDelete(categoryId: number) {
    const categoryExist = await this.CategoryRepository.findOne(categoryId);
    if (!categoryExist) {
      throw new HttpException(
        `Category ${ResponseMessage.DOES_NOT_EXIST}`,
        ResponseCode.NOT_FOUND,
      );
    }
    return await this.CategoryRepository.delete({ categoryId });
  }

  public async findOne(condition: any): Promise<Category> {
    return await this.CategoryRepository.findOne(condition);
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
  ): Promise<Pagination<Category>> {
    return paginate<Category>(this.CategoryRepository, options, {
      where: condition,
    });
  }
  
 
}
