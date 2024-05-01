
import Input from "./Input";
import Preview from "./Preview";
import Output from "./Output";

import { useState } from 'react';


export default function Main() {

    const [output] = useState("");


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
        <main>
            <Input/>
            <Preview/>
            <Output type={getType()} content={output} />
        </main>
    )
}