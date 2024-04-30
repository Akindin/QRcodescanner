import logo from './logo.svg';
import './App.css';
import FileInput from "./components/FileInput";

import readQRCode from "./utils/readQRCode";
import { useState } from 'react';
import Output from './components/Output';


function App() {

    const [output, setOutput] = useState("");

    async function handleFileAccept(file: File) {
        setOutput(await readQRCode(file));
    }

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

    return (
        <div className="App">
            <FileInput onFileAccepted={handleFileAccept} onFileRejected={console.log} />
            <Output type={getType()} content={output} />
        </div>
    );
}

export default App;
