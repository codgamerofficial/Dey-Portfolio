import { Injectable } from '@nestjs/common';
import axios from 'axios';
// import { Innertube } from 'youtubei.js';

@Injectable()
export class MusicService {
    private innertube: any;

    constructor() {
        this.initializeInnertube();
    }

    private async initializeInnertube() {
        // this.innertube = await Innertube.create();
        console.log('Innertube initialized (Mock)');
    }

    async searchAll(query: string) {
        // Parallel search: DB, Audius, YouTube
        const [audiusResults] = await Promise.all([
            this.searchAudius(query),
            // this.searchYouTube(query)
        ]);

        return {
            audius: audiusResults,
            youtube: []
        };
    }

    private async searchAudius(query: string) {
        try {
            const { data } = await axios.get(`https://discoveryprovider.audius.co/v1/tracks/search?query=${query}&app_name=SONIC_NEXUS`);
            return data.data;
        } catch (e) {
            console.error('Audius Error', e);
            return [];
        }
    }

    async getStream(id: string) {
        // Logic to return a readable stream from Innertube or S3
        // return await this.innertube.download(id, { type: 'audio' });
        throw new Error('Stream Proxy not fully implemented in scaffold');
    }
}
