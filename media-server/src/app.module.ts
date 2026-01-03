import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MusicModule } from './music/music.module';

@Module({
    imports: [MusicModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }
