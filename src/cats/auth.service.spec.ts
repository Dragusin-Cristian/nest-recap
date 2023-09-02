import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

describe('AuthService', () => {
  let service: AuthService;
  let fakeCatsService: Partial<CatsService>;

  beforeEach(async () => {
    // Create a fake copy of users service, (so we don't use the actual repository):
    fakeCatsService = {
      find: () => Promise.resolve([]),
      create: (newCat: CreateCatDto) =>
        Promise.resolve({
          id: 1,
          name: newCat.name,
          breed: newCat.breed,
          password: newCat.password,
        } as Cat),
      findByName: (name: string) => Promise.resolve([]),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CatsService,
          useValue: fakeCatsService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new cat with a salted and hashed password', async () => {
    const user = await service.signup('Criss', 'regal', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(hash).toBeDefined();
  });

  it('throws an error if cat signs up with name that is already in use', async () => {
    fakeCatsService.findByName = (name: string) =>
      Promise.resolve([{ id: 1, name: 'Criss', breed: 'regal' } as Cat]);

    await expect(service.signup('Criss', 'regal', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused name', async () => {
    await expect(service.signin('Cris', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt('pass', salt, 32)) as Buffer;
    fakeCatsService.findByName = (name: string) =>
      Promise.resolve([
        {
          id: 1,
          name: 'Criss',
          breed: 'regal',
          password: salt + '.' + hash.toString('hex'),
        } as Cat,
      ]);

    await expect(service.signin('Criss', 'some wrong pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if a correct pass is provided', async () => {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt('pass', salt, 32)) as Buffer;
    fakeCatsService.findByName = (name: string) =>
      Promise.resolve([
        {
          id: 1,
          name: 'Criss',
          breed: 'regal',
          password: salt + '.' + hash.toString('hex'),
        } as Cat,
      ]);

    const user = await service.signin('Criss', 'pass');
    expect(user).toBeDefined();
  });
});
