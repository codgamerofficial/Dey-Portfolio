
import { Controller, Get, Post, Query, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
    constructor(private readonly musicService: MusicService) { }

    @Get('search')
    async search(@Query('q') query: string) {
        // Return both local and potential external search results
        // For now, focusing on local uploads as requested
        return this.musicService.search(query);
    }

    @Get('my-uploads')
    async getMyUploads() {
        return this.musicService.getAllSongs();
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSong(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
        return this.musicService.uploadSong(file, body);
    }
}
