import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryDto } from './commons/category.dtos';

@Entity({
  name: 'categories',
})
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ length: 255 })
  name: string;

  fromDto(payload: CategoryDto): Category {
    this.name = payload.name;     
    return this;
  }
}
