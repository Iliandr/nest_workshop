import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import config from '~/config';
import { LoggerService } from '~/logger';
import { RestLoggingInterceptor } from '~/blocks/interceptors/rest-logging';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from '~/blocks/filters/exception-factory';
import { HttpExceptionFilter } from '~/blocks/filters/http-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService()
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RestLoggingInterceptor());
  await app.listen(config.http.port);
}
bootstrap();
