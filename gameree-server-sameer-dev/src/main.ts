import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationFormatter } from './helpers/validation-formatter.helper';
import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: any) =>
        new UnprocessableEntityException(ValidationFormatter(errors)),
    }),
  );

  const PORT = process.env.PORT;
  await app.listen(PORT, () => {
    console.log(`Server in running on port: ${PORT}`);
  });
}
bootstrap();
