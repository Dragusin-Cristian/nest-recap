import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cat } from 'src/cats/entities/cat.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @ManyToOne(() => Cat, (cat) => cat.reports)
  cat: Cat;
}
