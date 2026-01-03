import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend access
    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,POST',
        credentials: true,
    });

    await app.listen(4000);
    console.log('Media Server running on http://localhost:4000');
}
bootstrap();
