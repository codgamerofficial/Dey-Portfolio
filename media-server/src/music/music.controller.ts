
import { Controller, Get, Post, Delete, Param, Query, UseInterceptors, UploadedFile, Body, BadRequestException } from '@nestjs/common';
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
        console.log('Upload request received');
        if (!file) {
            console.error('No file received');
            throw new BadRequestException('File is missing');
        }
        console.log(`Processing file: ${file.originalname}, Size: ${file.size}`);
        try {
            return await this.musicService.uploadSong(file, body);
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
    @Delete(':id')
    async deleteSong(@Param('id') id: string) {
        return this.musicService.deleteSong(id);
    }
}
