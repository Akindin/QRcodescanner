type URISchemaType = "link" | "text" | "sms" | "phone" | "wifi" | "javascript"

export default function Output({ content }: { content: string }) {
    function copyToClipboard() {
        navigator.clipboard.writeText(content);
    }




    function getType(content: string): URISchemaType {
        // [-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
        // https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
        const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;

        console.log(content.match(regex))

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
            return (
                <tr>
                    <td>Результат</td>
                    <td><a href={content}>{content}</a></td>
                    <td><button onClick={copyToClipboard}>Скопировать в буфер обмена</button></td>
                </tr>
            )
        }
    }



    if (type === "text") {
        return (
            <output>
                <table>
                    <tbody>
                    </tbody>
                </table>
            </output>
        )
    } else {
        return (
            <output>
                <a href={content}>{content}</a>
                <button onClick={copyToClipboard}>Скопировать в буфер обмена</button>
            </output>
        )
    }
}