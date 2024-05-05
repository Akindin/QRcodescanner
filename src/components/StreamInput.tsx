export default function StreamInput({ onStreamReceived, onStreamRejected }: { onStreamReceived: (stream: MediaStream) => void, onStreamRejected: (message: string) => void }) {

    async function getStream(): Promise<MediaStream | string> {
        try {
            return await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            } else {
                return "Ошибка: " + error;
            }
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
            <button className="button open_camera" onClick={handleClick}>Включить камеру</button>
        </>
    )
}