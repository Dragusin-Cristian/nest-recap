import { Expose } from 'class-transformer'; // we can import also Exclude, and apply it to all fields wo don't want to show, but this is done by default.

export class CatDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  breed: string;
}
