
import FileInput from "./FileInput";
import StreamInput from "./StreamInput";
import Preview from "./Preview";
import Output from "./Output";

import readQRCode from "../utils/readQRCode";
import PreviewContent from "./../utils/PreviewContent";

import { useState, useRef } from 'react';

export default function Main() {
    const [output, setOutput] = useState("");
    const [preview, setPreview] = useState<PreviewContent>();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    async function handleFileAccept(file: File) {
        setPreview({
            type: "file",
            content: file
        });
        setOutput(await readQRCode(file));
    }

    function handleReject(message: string) {
        setPreview({
            type: "error",
            content: message
        })
    }

    async function waitForVideo() {
        return new Promise<void>((resolve, reject) => {
            const interval = setInterval(() => {
                if (videoRef !== null) {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    resolve();
                }
            }, 100);

            const timeout = setTimeout(() => {
                if (videoRef === null) {
                    clearInterval(interval);
                    reject("Время ожидания подключения камеры истекло");
                }
            }, 60 * 1000);
        })
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

            while (context && video) {
                context.drawImage(video, 0, 0, width, height);
                yield await readQRCode(context.getImageData(0, 0, width, height), 100);
            }
        }

        return "";
    }

    async function handleStream(stream: MediaStream) {
        setPreview({
            type: "stream",
            content: stream
        });
        try {
            await waitForVideo();

            for await (const output of generateDecryptions()) {
                console.log(output);
                if (output) {
                    setOutput(output);
                    setPreview(undefined);
                    break;
                }
            }

        } catch (error) {
            if (typeof error === "string") {
                handleReject(error);
            } else {
                console.log(error);
            }
        }
    }

    return (
        <main>
            <Preview previewContent={preview} ref={videoRef} />
            <div className='buttons'>
                <FileInput onFileAccepted={handleFileAccept} onFileRejected={handleReject} />
                <StreamInput onStreamReceived={handleStream} onStreamRejected={handleReject} />
            </div>
            <canvas ref={canvasRef} hidden></canvas>
            <Output content={output} />
        </main>
    )
}