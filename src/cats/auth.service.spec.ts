import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeCatsService: Partial<CatsService>;

  beforeEach(async () => {
    const cats: Cat[] = [];
    // Create a fake copy of users service, (so we don't use the actual repository):
    fakeCatsService = {
      find: () => Promise.resolve([]),
      create: (newCat: CreateCatDto) => {
        const cat = {
          id: cats.length * Math.floor(Math.random() * 999),
          name: newCat.name,
          breed: newCat.breed,
          password: newCat.password,
        } as Cat;
        cats.push(cat);
        return Promise.resolve(cat);
      },
      findByName: (name: string) => {
        const filteredCats = cats.filter((cat: Cat) => cat.name === name);
        return Promise.resolve(filteredCats);
      },
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
    await service.signup('Criss', 'regal', 'pass');

    await expect(service.signin('Criss', 'some wrong pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if a correct pass is provided', async () => {
    await service.signup('Criss', 'regal', 'pass');

    const user = await service.signin('Criss', 'pass');
    expect(user).toBeDefined();
  });

  it('throws if signup is called with an used name', async () => {
    await service.signup('Criss', 'regal', 'pass');
    await expect(service.signup('Criss', 'regal', 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });
});
