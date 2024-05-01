
import FileInput from "./FileInput";
import StreamInput from "./StreamInput";
import Preview from "./Preview";
import Output from "./Output";

import readQRCode from "../utils/readQRCode";

import { useState } from 'react';


export default function Main() {
    const [output, setOutput] = useState("");

    function getType(): "link" | "text" {
        // [-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
        // https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
        const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

        if (output.match(regex)) {
            return "link";
        } else {
            return "text";
        }
    }


    async function handleFileAccept(file: File) {
        setOutput(await readQRCode(file));
    }

    return (
        <main>
            <Preview />
            <div className='buttons'>
                <FileInput onFileAccepted={handleFileAccept} onFileRejected={console.log} />
                <StreamInput />
            </div>
            <Output type={getType()} content={output} />
        </main>
    )
}