import dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { environmentVariables } from './config/environment-variables';
import { setupSwaggerDocs } from './config/setup-docs';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/files/public',
    express.static(path.resolve(__dirname, '..', 'files')),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  if (environmentVariables.SHOW_DOCS) {
    setupSwaggerDocs(app);
  }

  app.use(helmet());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  await app.listen(environmentVariables.PORT);
}
bootstrap();
