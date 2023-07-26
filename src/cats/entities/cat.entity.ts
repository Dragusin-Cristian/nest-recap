import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  breed: string;

  @Column()
  @Exclude()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted cat with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated cat with id ', this.id);
  }

  @AfterRemove()
  logDelete() {
    console.log('Deleted cat with id ', this.id);
  }
}
