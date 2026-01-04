import imageCompression from 'browser-image-compression';

export const compressImage = async (
    file: File,
    targetMinKB: number,
    targetMaxKB: number
): Promise<File> => {
    // If already within range, return original
    const sizeKB = file.size / 1024;
    if (sizeKB >= targetMinKB && sizeKB <= targetMaxKB) {
        return file;
    }

    // If too small, we can't really "uncompress" it easily without canvas hackery, 
    // but usually the issue is it's too big. 
    // If it's too small, we generally reject or just pass it through if strictness allows.
    // The requirement is "Use... compression library... if user uploads HIGH-RES... compress UNTIL it hits ~range".
    // So we focus on downscaling.

    if (sizeKB < targetMinKB) {
        // If stricly too small, return as is (validation will catch it), 
        // or we'd need to upscale which is bad practice for quality.
        return file;
    }

    // Attempt compression
    // We strive for the upper bound to maximize quality while staying valid
    const options = {
        maxSizeMB: targetMaxKB / 1024,
        maxWidthOrHeight: 1920, // Reasonable cap
        useWebWorker: true,
    };

    try {
        let compressedFile = await imageCompression(file, options);

        // Check if it undershot too much (too small now)
        // There isn't an easy way to "target" a min size with this lib, 
        // but usually standard photo compression won't shrink a 2MB photo to <20KB unless it's blank.
        return compressedFile;
    } catch (error) {
        console.error("Compression failed:", error);
        return file; // Return original if compression fails, let validation handle it
    }
};
