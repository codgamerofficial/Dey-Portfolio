import { Controller, Get, Query, Param, Res } from '@nestjs/common';
import { MusicService } from './music.service';
import { Response } from 'express';

@Controller('music')
export class MusicController {
    constructor(private readonly musicService: MusicService) { }

    @Get('search')
    async search(@Query('q') query: string) {
        if (!query) return { error: 'Query required' };
        return this.musicService.searchAll(query);
    }

    @Get('stream/:id')
    async stream(@Param('id') id: string, @Res() res: Response) {
        res.set({
            'Content-Type': 'audio/mp4',
            'Transfer-Encoding': 'chunked',
        });
        const stream = await this.musicService.getStream(id);
        stream.pipe(res);
    }
}
