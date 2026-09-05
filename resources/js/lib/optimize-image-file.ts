export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

const TARGET_UPLOAD_BYTES = Math.floor(MAX_UPLOAD_BYTES * 0.92);
const QUALITY_STEPS = [0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42];

async function fileToDataUrl(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));
        reader.readAsDataURL(file);
    });
}

async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return await new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('ไม่สามารถประมวลผลรูปภาพได้'));
        image.src = dataUrl;
    });
}

async function canvasToFile(canvas: HTMLCanvasElement, quality: number, namePrefix: string): Promise<File> {
    return await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('ไม่สามารถบีบอัดรูปภาพได้'));

                return;
            }

            resolve(new File([blob], `${namePrefix}-${Date.now()}.jpg`, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
    });
}

type OptimizeOptions = {
    /** Filename stem for the compressed file, e.g. `banner` or `product`. */
    namePrefix: string;
    /** Longest edge kept after downscaling; banners need more than catalogue art. */
    maxWidth: number;
};

/**
 * Shrinks an oversized upload client-side so it fits the 2MB server limit,
 * stepping the JPEG quality down until the result is small enough.
 */
export async function optimizeImageFile(file: File, { namePrefix, maxWidth }: OptimizeOptions): Promise<File> {
    if (file.size <= TARGET_UPLOAD_BYTES) {
        return file;
    }

    const dataUrl = await fileToDataUrl(file);
    const image = await loadImage(dataUrl);

    const widthRatio = image.width > maxWidth ? maxWidth / image.width : 1;
    const targetWidth = Math.max(1, Math.round(image.width * widthRatio));
    const targetHeight = Math.max(1, Math.round(image.height * widthRatio));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('ไม่สามารถเตรียมรูปภาพเพื่ออัปโหลดได้');
    }

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    let compressed = await canvasToFile(canvas, QUALITY_STEPS[QUALITY_STEPS.length - 1], namePrefix);

    for (const quality of QUALITY_STEPS) {
        compressed = await canvasToFile(canvas, quality, namePrefix);

        if (compressed.size <= TARGET_UPLOAD_BYTES) {
            return compressed;
        }
    }

    if (compressed.size > MAX_UPLOAD_BYTES) {
        throw new Error('รูปภาพยังใหญ่เกิน 2MB หลังบีบอัด กรุณาลดขนาดไฟล์แล้วลองใหม่');
    }

    return compressed;
}
