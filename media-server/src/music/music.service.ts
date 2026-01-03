import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MusicService implements OnModuleInit {
    private innertube: any;

    async onModuleInit() {
        await this.initializeInnertube();
    }

    private async initializeInnertube() {
        try {
            // Dynamic import for ESM package
            const { Innertube, UniversalCache } = await import('youtubei.js');
            this.innertube = await Innertube.create({
                cache: new UniversalCache(false),
                generate_session_locally: true
            });
            console.log('Innertube initialized (Full)');
        } catch (error) {
            console.error('Failed to init Innertube:', error);
        }
    }

    async searchAll(query: string) {
        const [audiusResults, youtubeResults] = await Promise.all([
            this.searchAudius(query),
            this.searchYouTube(query)
        ]);

        return {
            audius: audiusResults,
            youtube: youtubeResults
        };
    }

    private async getAudiusHost(): Promise<string> {
        try {
            const { data } = await axios.get('https://api.audius.co');
            if (data.data && data.data.length > 0) {
                return data.data[0];
            }
            return 'https://discoveryprovider.audius.co';
        } catch (e) {
            console.error('Failed to resolve Audius Host', e);
            return 'https://discoveryprovider.audius.co';
        }
    }

    private async searchAudius(query: string) {
        try {
            const host = await this.getAudiusHost();
            const { data } = await axios.get(`${host}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=SONIC_NEXUS`);

            return data.data.slice(0, 5).map((track: any) => ({
                id: track.id,
                title: track.title,
                artist: track.user.name,
                album: 'Single',
                coverUrl: track.artwork ? track.artwork['480x480'] : null,
                duration: track.duration,
                source: 'AUDIUS'
            }));
        } catch (e) {
            console.error('Audius Error', e);
            return [];
        }
    }

    private async searchYouTube(query: string) {
        if (!this.innertube) return [];
        try {
            const results = await this.innertube.music.search(query);
            // Safety check for songs array
            if (!results.songs || !results.songs.contents) return [];

            return results.songs.contents.slice(0, 5).map((song: any) => ({
                id: song.id,
                title: song.title,
                artist: song.artists?.[0]?.name || 'Unknown',
                album: song.album?.name || 'Single',
                coverUrl: song.thumbnails?.[0]?.url || null,
                duration: song.duration?.seconds || 0,
                source: 'YOUTUBE'
            }));
        } catch (e) {
            console.error('YouTube Error', e);
            return [];
        }
    }

    async getStream(id: string): Promise<any> {
        if (!this.innertube) throw new Error('Innertube not initialized');
        try {
            // Download stream for streaming
            const stream = await this.innertube.download(id, {
                type: 'audio',
                quality: 'best',
                format: 'mp4'
            });
            return stream;
        } catch (e) {
            console.error('Stream Error', e);
            throw new Error('Failed to fetch stream');
        }
    }
}
