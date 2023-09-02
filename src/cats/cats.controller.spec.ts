import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { AuthService } from './auth.service';
import { Cat } from './entities/cat.entity';

//* When running unit tests, we don't have access to decorators, we make E2E tests for that.

describe('CatsController', () => {
  let controller: CatsController;
  let fakeCatsService: Partial<CatsService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeCatsService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, name: 'Criss', breed: 'regal' } as Cat);
      },
      find: (breed: string) => {
        return Promise.resolve([
          { id: 1, name: 'Criss', breed } as Cat,
          { id: 2, name: 'Ruru', breed } as Cat,
        ]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (name: string, password: string) => {
        return Promise.resolve({ id: 1, name, password } as Cat);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: fakeCatsService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find returns a list of cats wit a given breed', async () => {
    const cats = await controller.find('regal');
    expect(cats.length).toEqual(2);
    expect(cats[0].breed).toEqual('regal');
  });

  it('findOne returns single cat with a given id', async () => {
    const cat = await controller.findOne('1');
    expect(cat).toBeDefined();
  });

  it('findOne returns null if no cat was found with a given id', async () => {
    fakeCatsService.findOne = (id: number) => null;
    const cat = controller.findOne('1');
    expect(cat).toBeNull();
  });

  it('signin updates session and returns cat', async () => {
    const session: { catId?: number } = {};
    const cat = await controller.signin(
      { name: 'Criss', password: 'asdf' },
      session,
    );

    expect(cat.id).toEqual(1);
    expect(session.catId).toEqual(cat.id);
  });
});
