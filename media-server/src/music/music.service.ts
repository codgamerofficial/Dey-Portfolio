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

    private async getAudiusHost(): Promise<string> {
        try {
            const { data } = await axios.get('https://api.audius.co');
            if (data.data && data.data.length > 0) {
                return data.data[0];
            }
            return 'https://discoveryprovider.audius.co'; // Fallback
        } catch (e) {
            console.error('Failed to resolve Audius Host', e);
            return 'https://discoveryprovider.audius.co';
        }
    }

    private async searchAudius(query: string) {
        try {
            const host = await this.getAudiusHost();
            const { data } = await axios.get(`${host}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=SONIC_NEXUS`);

            // Transform to our Track interface
            return data.data.map((track: any) => ({
                id: track.id,
                title: track.title,
                artist: track.user.name,
                album: 'Single', // Audius tracks are often singles
                coverUrl: track.artwork ? track.artwork['480x480'] : null,
                duration: track.duration,
                source: 'AUDIUS'
            }));
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
