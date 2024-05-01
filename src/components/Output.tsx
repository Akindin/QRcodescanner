export default function Output({ type, content }: { type: "link" | "text", content: string }) {
    if (content === "") {
        content = "This field will contain information retrieved from the scanned QR code."
    }

    if (type === "link") {
        return (
            <output className="output_box">
                <p>
                    <a href={content}>{content}</a>
                </p>
            </output>
        )
    } else {
        return (
            <output className="output_box">
                <p>
                    {content}
                </p>
            </output>
        )
    }
}