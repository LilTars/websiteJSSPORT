import { PreviewFrame } from '@/pages/backoffice/components/ui-kit';

type PreviewGalleryProps = {
    previewUrls: string[];
    slideIndex: number;
    onSlideChange: (index: number) => void;
    /** Rendered on top of the active slide, e.g. the edit dialog's remove-image button. */
    overlay?: React.ReactNode;
};

const arrowClass = 'absolute top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 px-2 py-1 text-sm font-bold text-white';

/**
 * Side panel of the product create/edit dialogs: one large slide plus thumbnails.
 */
export default function PreviewGallery({ previewUrls, slideIndex, onSlideChange, overlay }: PreviewGalleryProps) {
    const activePreviewUrl = previewUrls[slideIndex] ?? previewUrls[0] ?? null;

    return (
        <aside className="flex flex-col gap-3 border-t border-border bg-muted/40 p-4 md:border-l md:border-t-0 md:p-5">
            <p className="text-sm font-semibold text-foreground">พรีวิวรูปภาพสินค้า</p>

            {activePreviewUrl ? (
                <div className="space-y-2 overflow-hidden rounded-xl border border-border bg-card p-2">
                    <div className="relative overflow-hidden rounded-lg bg-muted">
                        <img src={activePreviewUrl} alt={`preview-${slideIndex + 1}`} className="h-56 w-full object-contain" />
                        {overlay}
                        {previewUrls.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    aria-label="รูปก่อนหน้า"
                                    onClick={() => onSlideChange((slideIndex - 1 + previewUrls.length) % previewUrls.length)}
                                    className={`${arrowClass} left-2`}
                                >
                                    {'<'}
                                </button>
                                <button
                                    type="button"
                                    aria-label="รูปถัดไป"
                                    onClick={() => onSlideChange((slideIndex + 1) % previewUrls.length)}
                                    className={`${arrowClass} right-2`}
                                >
                                    {'>'}
                                </button>
                            </>
                        )}
                    </div>

                    {previewUrls.length > 1 && (
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground">รูปที่ {slideIndex + 1} / {previewUrls.length}</p>
                            <div className="flex gap-1 overflow-x-auto">
                                {previewUrls.map((previewUrl, index) => (
                                    <button
                                        key={`${previewUrl}-${index}`}
                                        type="button"
                                        aria-label={`ดูรูปที่ ${index + 1}`}
                                        onClick={() => onSlideChange(index)}
                                        className={`h-12 w-12 overflow-hidden rounded-md border ${index === slideIndex ? 'border-amber-500' : 'border-border'}`}
                                    >
                                        <img src={previewUrl} alt={`thumb-${index + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <PreviewFrame className="flex h-56 items-center justify-center border-dashed bg-card text-sm text-muted-foreground">
                    ยังไม่มีรูปที่เลือก
                </PreviewFrame>
            )}
        </aside>
    );
}
