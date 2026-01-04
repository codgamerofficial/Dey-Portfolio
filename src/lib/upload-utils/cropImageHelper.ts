export const getCroppedImg = (
    imageSrc: string,
    pixelCrop: any,
    grayscale: boolean = false,
    targetWidth?: number,
    targetHeight?: number
): Promise<Blob | null> => {
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
            image.src = url;
        });

    return new Promise(async (resolve, reject) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return reject(null);
        } // set width to double image size to allow for a safe area for the
        // image to rotate in the center without being clipped

        // Use target dimensions if provided (for strict passport sizing), otherwise use crop dimensions
        canvas.width = targetWidth || pixelCrop.width;
        canvas.height = targetHeight || pixelCrop.height;

        if (grayscale) {
            ctx.filter = 'grayscale(100%) contrast(1.25) brightness(1.1)';
        }

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            canvas.width, // Draw to full canvas size (scales if needed)
            canvas.height);

        canvas.toBlob((file) => {
            resolve(file);
        }, 'image/jpeg', 1.0); // Use max quality to meet min-size requirements for small dimensions
    });
};
