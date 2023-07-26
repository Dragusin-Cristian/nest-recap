import { HttpStatus, Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsRepository } from './cats.repository';

@Injectable() //* this is for DI Container
export class CatsService {
  constructor(public catsRepository: CatsRepository) {
    // this.catsRepository = new CatsRepository(); //* this is bad becasue it doesn't respect the inversion of control principle.
  }

  create(createCatDto: CreateCatDto) {
    return this.catsRepository.create(createCatDto.name);
  }

  findAll() {
    return this.catsRepository.findAll();
  }

  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    // or just ParseIntPipe
    return this.catsRepository.findOne(id);
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
