export default function Output({ type, content }: { type: "link" | "text", content: string }) {
    function copyToClipboard() {
        navigator.clipboard.writeText(content);
    }

    if (type === "link") {
        return (
            <output>
                <a href={content}>{content}</a>
                <button onClick={copyToClipboard}>Скопировать в буфер обмена</button>
            </output>
        )
    } else {
        return (
            <output>
                <>{content}</>
                <button onClick={copyToClipboard}>Скопировать в буфер обмена</button>
            </output>
        )
    }
}