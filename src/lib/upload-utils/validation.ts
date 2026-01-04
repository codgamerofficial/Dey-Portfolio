export interface ValidationRules {
    maxSizeKB: number;
    minSizeKB: number;
    allowedTypes: string[];
    width?: number;
    height?: number;
    // Optional tolerance for dimensions in pixels
    dimensionTolerance?: number;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export const validateImage = async (
    file: File,
    rules: ValidationRules
): Promise<ValidationResult> => {
    const errors: string[] = [];
    const { maxSizeKB, minSizeKB, allowedTypes, width, height, dimensionTolerance = 0 } = rules;

    // 1. Format Validation
    if (!allowedTypes.includes(file.type)) {
        errors.push(`Invalid format. Allowed: ${allowedTypes.join(', ')}`);
    }

    // 2. Size Validation
    const sizeKB = file.size / 1024;
    if (sizeKB > maxSizeKB) {
        errors.push(`File too large (${sizeKB.toFixed(2)}KB). Max: ${maxSizeKB}KB`);
    }
    if (sizeKB < minSizeKB) {
        errors.push(`File too small (${sizeKB.toFixed(2)}KB). Min: ${minSizeKB}KB`);
    }

    // 3. Dimension Validation (only if file is an image and dimensions are specified)
    if ((width || height) && file.type.startsWith('image/')) {
        try {
            const dimensions = await getImageDimensions(file);

            if (width) {
                const diff = Math.abs(dimensions.width - width);
                if (diff > dimensionTolerance) {
                    errors.push(`Invalid width: ${dimensions.width}px. Expected: ~${width}px`);
                }
            }

            if (height) {
                const diff = Math.abs(dimensions.height - height);
                if (diff > dimensionTolerance) {
                    errors.push(`Invalid height: ${dimensions.height}px. Expected: ~${height}px`);
                }
            }
        } catch (e) {
            errors.push("Could not determine image dimensions.");
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};
