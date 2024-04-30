import './App.css';

import { useState } from 'react';

import readQRCode from "./utils/readQRCode";

import FileInput from "./components/FileInput";
import Output from './components/Output';
import Stream from './components/Stream';


function App() {

    const [output, setOutput] = useState("");

    async function handleFileAccept(file: File) {
        setOutput(await readQRCode(file));
    }



    return (
        <div className="App">
            <FileInput onFileAccepted={handleFileAccept} onFileRejected={console.log} />
            <Stream onOutputReceived={setOutput} />
            <Output content={output} />
        </div>
    );
}

export default App;
