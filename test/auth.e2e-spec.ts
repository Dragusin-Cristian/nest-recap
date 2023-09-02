import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  it('handles a signup request', () => {
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
});
