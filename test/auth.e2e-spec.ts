import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const defName = 'Criss';
    const defBbreed = 'regal';
    return request(app.getHttpServer())
      .post('/cats/signup')
      .send({
        name: defName,
        breed: defBbreed,
        password: 'miau1234',
      })
      .expect(201)
      .then((res) => {
        const { id, name, breed } = res.body;
        expect(id).toBeDefined();
        expect(name).toEqual(defName);
        expect(breed).toEqual(defBbreed);
      });
  });

  it('signup as a new cat then get the currently logged cat', async () => {
    const name = 'Cristi';
    const password = 'asdf';
    const breed = 'regal';

    const res = await request(app.getHttpServer())
      .post('/cats/signup')
      .send({ name, password, breed })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/cats/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.name).toEqual(name);
    expect(body.breed).toEqual(breed);
  });
});
