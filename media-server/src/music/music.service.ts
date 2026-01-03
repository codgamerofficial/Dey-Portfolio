
import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MusicService {
    private readonly songsFilePath = path.join(process.cwd(), 'data', 'songs.json');
    private readonly uploadDir = path.join(process.cwd(), 'uploads');

    constructor() {
        this.ensureDataFile();
    }

    private ensureDataFile() {
        if (!fs.existsSync(this.songsFilePath)) {
            const dir = path.dirname(this.songsFilePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.songsFilePath, '[]');
        }
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async uploadSong(file: Express.Multer.File, body: any) {
        if (!file) throw new BadRequestException('No file uploaded');

        const { title, artist } = body;
        const songId = uuidv4();
        const fileExt = path.extname(file.originalname);
        const fileName = `${songId}${fileExt}`;
        const filePath = path.join(this.uploadDir, fileName);

        // Write file to uploads directory
        fs.writeFileSync(filePath, file.buffer);

        // Create song entry
        const songAtr = {
            id: songId,
            title: title || file.originalname,
            artist: artist || 'Unknown Artist',
            album: 'Sonic Uploads',
            duration: 0, // Duration calculation would require 'music-metadata' or similar, strict validation skipped for speed
            coverUrl: '', // Could allow cover upload too, but optional for now
            audioUrl: `http://localhost:4000/uploads/${fileName}`,
            source: 'UPLOAD'
        };

        // Save to JSON
        const songs = this.getAllSongs();
        songs.push(songAtr);
        fs.writeFileSync(this.songsFilePath, JSON.stringify(songs, null, 2));

        return songAtr;
    }

    getAllSongs() {
        if (!fs.existsSync(this.songsFilePath)) return [];
        const data = fs.readFileSync(this.songsFilePath, 'utf-8');
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    search(query: string) {
        const songs = this.getAllSongs();
        if (!query) return { local: songs };

        const lowerQ = query.toLowerCase();
        const filtered = songs.filter(s =>
            s.title.toLowerCase().includes(lowerQ) ||
            s.artist.toLowerCase().includes(lowerQ)
        );
        return { local: filtered };
    }
}
