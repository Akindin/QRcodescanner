import parseUrl from "parse-url";
import { MouseEvent } from "react";
type URISchemaType = "link" | "text" | "sms" | "phone" | "wifi" | "javascript"



export default function Output({ content }: { content: string }) {
    function copyToClipboard(event: MouseEvent) {
        const button = event.target as HTMLButtonElement;
        const copiedText = document.querySelector(`[data-id=${button.dataset.for}`)?.textContent;
        navigator.clipboard.writeText(copiedText ?? "undefined");
    }



    function getType(content: string): URISchemaType {
        // [-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
        // https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
        const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;

        console.log(content.match(regex))

        try {
            console.log(parseUrl(content));
        } catch (error) {
            console.log(error)
        }

        if (content.match(regex)) {
            return "link";
        } else {
            return "text";
        }
    }

    let type: URISchemaType = getType(content);

    function getContentData() {
        if (type === "text") {
            return (
                <tr>
                    <td>Результат</td>
                    <td>{content}</td>
                    <td><button onClick={copyToClipboard}>Скопировать в буфер обмена</button></td>
                </tr>
            )
        } else {

            function mapEntries([key, value]: [string, any]) {
                return (
                    <tr>
                        <td>{key}</td>
                        <td data-id={key}>{value.toString()}</td>
                        <td><button onClick={copyToClipboard} data-for={key}>Скопировать в буфер обмена</button></td>
                    </tr>
                )
            }

            console.log(Object.entries(parseUrl(content)).map(mapEntries))

            return [...Object.entries(parseUrl(content)).map(mapEntries)];

            // console.log(
            //     [<tr>
            //         <td>Результат</td>
            //         <td><a href={content}>{content}</a></td>
            //         <td><button onClick={copyToClipboard}>Скопировать в буфер обмена</button></td>
            //     </tr>,
            //     <tr>
            //         <td>Результат</td>
            //         <td><a href={content}>{content}</a></td>
            //         <td><button onClick={copyToClipboard}>Скопировать в буфер обмена</button></td>
            //     </tr>]
            // )

            // return (
            //     [<tr>
            //         <td>Результат</td>
            //         <td><a href={content}>{content}</a></td>
            //         <td><button onClick={copyToClipboard}>Скопировать в буфер обмена</button></td>
            //     </tr>,
            //     <tr>
            //         <td>Результат</td>
            //         <td><a href={content}>{content}</a></td>
            //         <td><button onClick={copyToClipboard}>Скопировать в буфер обмена</button></td>
            //     </tr>]
            // )
        }
    }


    return (
        <output>
            <table>
                <tbody>
                    {getContentData()}
                </tbody>
            </table>
        </output>
    )
}