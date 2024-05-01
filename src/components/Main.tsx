
import FileInput from "./FileInput";
import StreamInput from "./StreamInput";
import Preview from "./Preview";
import Output from "./Output";

import readQRCode from "../utils/readQRCode";
import PreviewContent from "./../utils/PreviewContent";

import { useState } from 'react';

export default function Main() {
    const [output, setOutput] = useState("");
    const [preview, setPreview] = useState<PreviewContent>();

    async function handleFileAccept(file: File) {
        setPreview({
            type: "file",
            content: file
        });
        setOutput(await readQRCode(file));
    }

    function handleFileReject(message: string) {
        setPreview({
            type: "error",
            content: message
        })
    }

    return (
        <main>
            <Preview previewContent={preview} />
            <div className='buttons'>
                <FileInput onFileAccepted={handleFileAccept} onFileRejected={handleFileReject} />
                <StreamInput />
            </div>
            <Output content={output} />
        </main>
    )
}