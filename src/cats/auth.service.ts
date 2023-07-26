import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly catsService: CatsService) {}

  async signup(name: string, breed: string, password: string) {
    const cats = await this.catsService.findByName(name);
    if (cats.length) {
      throw new BadRequestException('cat already exists');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const cat = await this.catsService.create({
      name,
      breed,
      password: result,
    });

    return cat;
  }

  async signin(name: string, password: string) {
    const [cat] = await this.catsService.findByName(name);
    if (!cat) {
      throw new NotFoundException('Cat not found.');
    }

    const [salt, storedHash] = cat.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong password');
    }

    return cat;
  }
}
