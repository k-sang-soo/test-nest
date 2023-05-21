import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  //beforeEach 은 각각의 테스트를 할 때 마다 어플리케이션을 새로 생성함 , DB가 매번 초기화 됨
  //beforeAll은 어플리케이션을 한번 생성하고 유지함
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    //!!! main.ts와 같은 실제 어플레케이션 환경과 맞게 작동하도록 설정
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, //맞지 않는 걸 보내면 접근조차 못하게 막는다.
        forbidNonWhitelisted: true, // 누군가 이상한 걸 보내면, 리퀘스트 자체를 막는 기능
        transform: true, //클라이언트에서 보낸 데이터 타입을 서버에서 필요한 타입으로 변경
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Welcome');
  });

  describe('/movies', () => {
    it('GET', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });
    it('POST 201', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Test',
          year: 2023,
          genres: ['Test'],
        })
        .expect(201);
    });
    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Test',
          year: 2023,
          genres: ['Test'],
          other: 'thing', //지정되지 않은 key,value 값 보내기
        })
        .expect(400); //forbidNonWhitelisted가 true이기 때문에 400에러를 보내줄꺼임
    });
    it('DELETE', () => {
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('movies/:id', () => {
    it('GET 200', () => {
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });
    it('GET 404', () => {
      return request(app.getHttpServer()).get('/movies/999').expect(404);
    });
    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'Updated Test' })
        .expect(200);
    });
    it('DELETE 200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  });
});
