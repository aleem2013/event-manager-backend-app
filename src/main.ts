import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // JSON middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Enable CORS
  app.enableCors({
    origin: '*',//['http://localhost:5173','https://your-frontend-domain.vercel.app'], // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Add global prefix
  app.setGlobalPrefix('api');


  app.useGlobalPipes(new ValidationPipe());

  // Force JSON content type for all responses
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Event Management API')
    .setDescription('API for managing events and attendance')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //await app.listen(process.env.PORT ?? 3000); //local
  await app.listen(process.env.PORT || 3000);  //prod

}
bootstrap();
