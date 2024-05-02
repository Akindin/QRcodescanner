export default function StreamInput({ onStreamReceived, onStreamRejected }: { onStreamReceived: (stream: MediaStream) => void, onStreamRejected: (message: string) => void }) {

    async function getStream(): Promise<MediaStream | string> {
        try {
            return await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        } catch (e) {
            const error = e as Error;
            return error.message;
        }
    }

    async function handleClick() {
        let stream = await getStream();
        if (typeof stream === "string") {
            onStreamRejected(stream);
        } else {
            onStreamReceived(stream);
        }
    }

    return (
        <>
            <button className="button open_camera" onClick={handleClick}>Turn On the Camera</button>
        </>
    )
}