import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //맞지 않는 걸 보내면 접근조차 못하게 막는다.
      forbidNonWhitelisted: true, // 누군가 이상한 걸 보내면, 리쉐스트 자체를 막는 기능
      transform: true, //클라이언트에서 보낸 데이터 타입을 서버에서 필요한 타입으로 변경
    }),
  );
  await app.listen(3000);
}
bootstrap();
