import FileInput from "./FileInput";
import StreamInput from "./StreamInput";

import { useState } from 'react';

import {
    readBarcodesFromImageFile,
    readBarcodesFromImageData,
    type ReadResult
} from "zxing-wasm/reader";


function reduceToString(accumulator: string, readResult: ReadResult): string {
    return accumulator + readResult.text;
}

async function readImageFromFile(file: File): Promise<string> {
    const recognition = await readBarcodesFromImageFile(file);
    console.log(recognition);
    return recognition.reduce(reduceToString, "");
}



export default function Input() {

    const [output, setOutput] = useState("");


    async function handleFileAccept(file: File) {
        setOutput(await readImageFromFile(file));
    }


    return (
        <div className='buttons'>
            <FileInput onFileAccepted={handleFileAccept} onFileRejected={console.log} />
            <StreamInput/>
        </div>
    )
}