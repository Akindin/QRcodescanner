import {
    type MutableRefObject
} from 'react';
import logo from './logo.svg';
import './App.css';
import FileInput from "./components/FileInput";

import {
    readBarcodesFromImageFile,
    readBarcodesFromImageData,
    type ReadResult
} from "zxing-wasm/reader";

function reduceToString(accumulator: string, readResult: ReadResult): string {
    return accumulator + readResult.text;
}

async function readImageFromInput(inputRef: MutableRefObject<HTMLInputElement>): Promise<string> {
    if (inputRef.current.files?.[0]) {
        const recognition = await readBarcodesFromImageFile(inputRef.current.files[0]);
        console.log(recognition);
        return recognition.reduce(reduceToString, "");
    } else {
        return "Файл не привязан";
    }
}

function App() {
    return (
        <div className="App">
            <FileInput onFileAccepted={console.log} onFileRejected={console.log} />
        </div>
    );
}

export default App;
