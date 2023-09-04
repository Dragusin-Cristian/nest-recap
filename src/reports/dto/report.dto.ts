import { Expose, Transform } from 'class-transformer';
import { Cat } from 'src/cats/entities/cat.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  mileage: number;

  @Transform(({ obj }) => obj.cat.id)
  @Expose()
  catId: number;
}
