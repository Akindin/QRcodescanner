import { useRef, useState } from "react";
import readQRcode from "./../utils/readQRCode";

export default function Stream({ onOutputReceived }: { onOutputReceived: (output: string) => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState()

    
    async function getStream(): Promise<MediaStream | null> {
        try {
            return await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function playStream(stream: MediaStream | null) {
        if (stream) {
            const video = videoRef.current;
            if (video) {
                video.srcObject = stream;
                await video.play();
            }
        }
    }

    async function* generateDecryptions(): AsyncIterableIterator<string> {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {

            const width = video.videoWidth;
            const height = video.videoHeight;
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d", {
                willReadFrequently: true
            });
            console.log(width);
            console.log(height);

            while (context && video) {
                context.drawImage(video, 0, 0, width ?? 200, height ?? 200);
                yield await readQRcode(context.getImageData(0, 0, width, height), 100);
            }
        }

        return "";
    }


    async function startRecognision() {

        await playStream(await getStream());
        for await (const output of generateDecryptions()) {
            console.log(output);
            if (output) {
                onOutputReceived(output);
                break;
            }
        }
    }


    return (
        <>
            <canvas ref={canvasRef} hidden></canvas>
            <video ref={videoRef}></video>
            <button onClick={startRecognision}>Read from camera</button>
        </>
    )
}