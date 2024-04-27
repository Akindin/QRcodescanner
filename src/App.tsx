import {
    type MutableRefObject
} from 'react';
import logo from './logo.svg';
import './App.css';

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
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
