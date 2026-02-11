import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para tu frontend
  app.enableCors({
    origin: ['http://localhost:3005', 'https://gastonverdeinmobiliaria.com.ar', 'https://www.gastonverdeinmobiliaria.com.ar', 'https://gastonverde.srv805858.hstgr.cloud'], // URL de tu frontend React    
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefijo global para las rutas
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  console.log(`📁 Uploads disponibles en http://localhost:${port}/uploads`);
  
}
bootstrap();
