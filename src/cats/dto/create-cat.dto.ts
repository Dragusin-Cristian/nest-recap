import { IsString } from 'class-validator'; //* needs to be installed

export class CreateCatDto {
  @IsString() //* this is a validator that ensures that whenever we create a new cat instance, the name is actually string
  name: string;
}
