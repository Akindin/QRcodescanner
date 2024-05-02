import PreviewContent from "./../utils/PreviewContent";
import StreamPreview from "./StreamPreview";
import { forwardRef } from 'react';

type PreviewProps = { previewContent: PreviewContent | undefined };

export default forwardRef<HTMLVideoElement, PreviewProps>(function Preview({ previewContent }: { previewContent: PreviewContent | undefined }, ref) {
    if (!previewContent) {
        return (
            <section className="preview">
                <p>
                    In order to scan the QR code, please select a file or turn on the camera on your device.
                </p>
            </section>
        )
    }

    switch (previewContent.type) {
        case "error":
            return (
                <section className="preview">
                    <p>
                        {previewContent.content}
                    </p>
                </section>
            )
        case "file":
            const imageSrc = URL.createObjectURL(previewContent.content);

            return (
                <section className="preview">
                    <img src={imageSrc} alt="Загруженное изображение" />
                </section>
            )
        case "stream":
            return (
                <section className="preview">
                    <StreamPreview stream={previewContent.content} ref={ref} />
                </section>
            )
    }

})