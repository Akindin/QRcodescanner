
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

    function getType(): "link" | "text" {
        // [-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)
        // https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)
        const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;

        if (output.match(regex)) {
            return "link";
        } else {
            return "text";
        }
    }



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
            <Output type={getType()} content={output} />
        </main>
    )
}