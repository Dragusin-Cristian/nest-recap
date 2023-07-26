import {
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatsService {
  constructor(@InjectRepository(Cat) private readonly repo: Repository<Cat>) {}

  create(createCatDto: CreateCatDto) {
    //* hooks inside cat entity won't run if we don't first create this object:
    const cat = this.repo.create({
      name: createCatDto.name,
      breed: createCatDto.breed,
      password: createCatDto.password,
    });

    return this.repo.save(cat);
  }

  findAll() {
    return this.repo.find();
  }

  findByName(name: string) {
    return this.repo.find({ where: { name } });
  }

  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    // or just ParseIntPipe
    return this.repo.findOneBy({ id });
  }

  find(breed: string) {
    return this.repo.find({ where: { breed } });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    // return this.repo.update(id, updateCatDto); //* quick approach
    const cat = await this.findOne(id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    Object.assign(cat, updateCatDto);
    return this.repo.save(cat);
  }

  async remove(id: number) {
    // return this.repo.delete(id); //* quick approach
    const cat = await this.findOne(id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return this.repo.remove(cat);
  }
}
