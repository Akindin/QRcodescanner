import parseUrl from "parse-url";
import { MouseEvent } from "react";



export default function Output({ content }: { content: string }) {
    function copyToClipboard(event: MouseEvent) {
        const button = event.target as HTMLButtonElement;
        const copiedText = document.querySelector(`[data-id=${button.dataset.for}`)?.textContent;
        navigator.clipboard.writeText(copiedText ?? "undefined");
    }



    // function getType(content: string) {
    //     // [-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
    //     // https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
    //     const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;

    //     console.log(content.match(regex))

    //     try {
    //         console.log(parseUrl(content));
    //     } catch (error) {
    //         console.log(error)
    //     }

    //     if (content.match(regex)) {
    //         return "link";
    //     } else {
    //         return "text";
    //     }
    // }

    function mapEntries([key, value]: [string, string]) {
        function getValue() {
            if (key === "Ссылка") {
                return <a href={value} target="_blank" rel="noreferrer">{value}</a>
            } else {
                return <>{value}</>
            }
        }

        return (
            <tr key={key}>
                <td>{key}</td>
                <td data-id={key}>{getValue()}</td>
                <td><button onClick={copyToClipboard} data-for={key}>Скопировать в буфер обмена</button></td>
            </tr>
        )
    }

    // let type = getType(content);

    function getTSX() {
        return Object.entries(getContentData(content)).map(mapEntries);
    }



    function getContentData(content: string): object {
        const raw = {
            "Результат": content
        }
        try {
            const parsedURL = parseUrl(content);
            console.log(parsedURL);
            const result: {
                [index: string]: string
            } = {};


            // "link" | "text" | "sms" | "phone" | "wifi" | "javascript"
            // It parses not only links but protocol definition contains only "http" | "https" | "ssh" | "file" | "git"
            switch (parsedURL.protocol as string) {
                case "http":
                case "https":
                    result["Ссылка"] = parsedURL.href;
                    result["Протокол"] = parsedURL.protocol;
                    result["Хост"] = parsedURL.host;
                    if (parsedURL.search) {
                        result["Поиск"] = parsedURL.query["text"];
                    }
                    break;
                default:
                    return raw;
            }

            return result;


        } catch (error) {
            return raw;
        }
    }


    return (
        <output>
            <table>
                <tbody>
                    {getTSX()}
                </tbody>
            </table>
        </output>
    )
}