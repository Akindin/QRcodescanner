import './App.css';
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

// import {
//     readBarcodesFromImageFile,
//     readBarcodesFromImageData,
//     type ReadResult
// } from "zxing-wasm/reader";
// import { useState } from 'react';

// import Output from './components/Output';

// function reduceToString(accumulator: string, readResult: ReadResult): string {
//     return accumulator + readResult.text;
// }

// async function readImageFromFile(file: File): Promise<string> {
//     const recognition = await readBarcodesFromImageFile(file);
//     console.log(recognition);
//     return recognition.reduce(reduceToString, "");
// }


function App() {

    // const [output, setOutput] = useState("");

    // async function handleFileAccept(file: File) {
    //     setOutput(await readImageFromFile(file));
    // }

    // function getType(): "link" | "text" {
    //     // [-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
    //     // https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
    //     const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

    //     if (output.match(regex)) {
    //         return "link";
    //     } else {
    //         return "text";
    //     }
    // }

    return (
        <div className="App">
            <Header/>
            <Main/>
            <Footer/>
        </div>
    );
}

export default App;
