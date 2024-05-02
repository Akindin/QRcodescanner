import { useEffect, forwardRef, type ForwardedRef, type MutableRefObject } from "react";

type StreamPreviewProps = { stream: MediaStream };

export default forwardRef<HTMLVideoElement, StreamPreviewProps>(function StreamPreview({ stream }, ref: ForwardedRef<HTMLVideoElement>) {
    useEffect(() => {
        async function playVideo() {
            if (ref) {
                if ("current" in ref) {
                    const video = ref?.current
                    if (video) {
                        video.srcObject = stream;
                        await video.play();
                    }
                }
            }
        }
        playVideo().catch(console.log)
    });

    return <video ref={ref}></video>
})