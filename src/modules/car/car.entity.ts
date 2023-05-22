import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarDto } from './commons/car.dtos';
import { Category } from '../category/category.entity';

@Entity({
  name: 'car',
})
export class Car {
  @PrimaryGeneratedColumn()
  carId: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'color',
    type: 'varchar',
    nullable: false,
  })
  color: string;

  @Column({
    name: 'model',
    type: 'varchar',
    nullable: false,
  })
  model: string;

  @Column({
    name: 'make',
    type: 'varchar',
    nullable: false,
  })
  make: string;

  @Column({
    name: 'registration_no',
    type: 'varchar',
    nullable: false,
  })
  registration_no: string;

  @Column({
    name: 'category_id',
    type: 'int',
    nullable: false,
  })
  category_id: number;

  @OneToMany(() => Category, category => category.categoryId)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  fromDto(payload: CarDto): Car {
    this.name = payload.name;
    this.color = payload.color;
    this.model = payload.model;
    this.make = payload.make;
    this.registration_no = payload.registration_no;
    this.category_id = payload.category_id;
    return this;
  }
}
