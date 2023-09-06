import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Report } from '../../reports/report.entity';

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

  @Column({ default: true })
  admin: boolean;

  //* because of circular dependency, we have to wrap the types in functions:
  @OneToMany(() => Report, (report) => report.cat)
  reports: Report[];

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
