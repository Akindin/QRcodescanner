import parseUrl from "parse-url";
import { MouseEvent } from "react";
import copy_icon from '../img/copy_icon.svg';


export default function Output({ content }: { content: string }) {
    function copyToClipboard(event: MouseEvent) {
        const button = event.target as HTMLButtonElement;
        const copiedText = document.querySelector(`[data-id=${button.dataset.for}`)?.textContent;
        console.log(document.querySelector(`[data-id=${button.dataset.for}`));
        navigator.clipboard.writeText(copiedText ?? "undefined");
    }

    function mapEntries([key, value]: [string, string]) {
        function getValue() {
            if (key === "Ссылка") {
                return <ruby> <a href={value} target="_blank" rel="noreferrer">{value} </a><rp>(</rp><rt>{key}</rt><rp>)</rp> </ruby>
            } else {
                return <ruby> {value} <rp>(</rp><rt>{key}</rt><rp>)</rp> </ruby>
            }
        }

        // return (
        //     <tr key={key}>
        //         <td>{key}</td>
        //         <td data-id={key}>{getValue()}</td>
        //         <td><img onClick={copyToClipboard} data-for={key} src={copy_icon} alt="Скопировать в буфер обмена" /></td>
        //     </tr>
        // )

        return (
            <li key={key}>
                <div className="output_item">
                    {getValue()}
                    <img onClick={copyToClipboard} data-for={key} src={copy_icon} alt="Скопировать в буфер обмена" />
                </div>
            </li>
        )
    }

    function getTSX() {
        return Object.entries(getContentData(content)).map(mapEntries);
    }

    function parseWiFi(wifi: string) {
        const nonEscapedСolon = /[^\\](:)/g;
        const nonEscapedSemicolon = /[^\\](;)/g;


        const result: {
            [index: string]: string
        } = {};

        let start = 0;
        while (true) {
            if (nonEscapedСolon.exec(wifi) === null) {
                break;
            }
            nonEscapedSemicolon.exec(wifi);
            result[wifi.slice(start, nonEscapedСolon.lastIndex - 1)] = wifi.slice(nonEscapedСolon.lastIndex, nonEscapedSemicolon.lastIndex - 1).replaceAll(/\\,|\\;|\\\/|\\:/g, (a) => {
                return a.charAt(1);
            });
            start = nonEscapedSemicolon.lastIndex;
        }

        return result;
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

            // It parses not only links but protocol definition contains only "http" | "https" | "ssh" | "file" | "git"
            switch (parsedURL.protocol as string) {
                case "http":
                case "https":
                    result["Тип"] = "Ссылка";
                    result["Ссылка"] = parsedURL.href;
                    result["Протокол"] = parsedURL.protocol;
                    result["Хост"] = parsedURL.host;
                    if (parsedURL.search) {
                        result["Поиск"] = parsedURL.query["text"];
                    }
                    break;
                case "mailto":
                    result["Тип"] = "Письмо";
                    result["Ссылка"] = parsedURL.href;
                    result["Получатель"] = parsedURL.pathname;
                    if (parsedURL.search) {
                        result["Тема письма"] = parsedURL.query["subject"];
                        result["Вторичные получатели"] = parsedURL.query["cc"];
                        result["Скрытые получатели"] = parsedURL.query["bcc"];
                        result["Содержимое письма"] = parsedURL.query["body"];
                    }
                    break;
                case "tel":
                    result["Тип"] = "Телефон";
                    result["Ссылка"] = parsedURL.href;
                    result["Номер телефона"] = parsedURL.pathname;
                    break;
                case "sms":
                    result["Тип"] = "СМС";
                    result["Ссылка"] = parsedURL.href;
                    result["Номер телефона"] = parsedURL.pathname;
                    if (parsedURL.search) {
                        result["Содержимое смс"] = parsedURL.query["body"];
                    }
                    break;
                case "wifi":
                    result["Тип"] = "Wi-Fi";
                    result["Ссылка"] = parsedURL.href;
                    const parsedWiFi = parseWiFi(parsedURL.pathname);
                    result["SSID"] = parsedWiFi["s"] ?? parsedWiFi["S"];
                    result["Пароль"] = parsedWiFi["p"] ?? parsedWiFi["P"];
                    result["Защита"] = parsedWiFi["t"] ?? parsedWiFi["T"];
                    break;
                case "javascript":
                    result["Тип"] = "JS код";
                    result["Ссылка"] = parsedURL.href;
                    result["Код"] = parsedURL.pathname;
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
            <ul>
                {getTSX()}
            </ul>
        </output>

    )
}