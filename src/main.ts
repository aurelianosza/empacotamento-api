import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(validationPipe);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
