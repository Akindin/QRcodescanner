import parseUrl from "parse-url";
import { MouseEvent } from "react";



export default function Output({ content }: { content: string }) {
    function copyToClipboard(event: MouseEvent) {
        const button = event.target as HTMLButtonElement;
        const copiedText = document.querySelector(`[data-id=${button.dataset.for}`)?.textContent;
        navigator.clipboard.writeText(copiedText ?? "undefined");
    }

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

    function getTSX() {
        return Object.entries(getContentData(content)).map(mapEntries);
    }

    function parseWiFi(wifi: string) {
        wifi = wifi.toLowerCase();
        const result: {
            [index: string]: string
        } = {};
        while (wifi.indexOf(":") !== -1) {
            result[wifi.slice(0, wifi.indexOf(":"))] = wifi.slice(wifi.indexOf(":") + 1, wifi.indexOf(";"));
            wifi = wifi.slice(wifi.indexOf(";") + 1);
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


            // "link" | "text" | "sms" | "phone" | "wifi" | "javascript"
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
                    result["SSID"] = parsedWiFi["s"];
                    result["Пароль"] = parsedWiFi["p"];
                    result["Защита"] = parsedWiFi["t"];
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