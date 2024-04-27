export default function Output({ type, content }: { type: "link" | "text", content: string }) {
    if (type === "link") {
        return (
            <output>
                <a href={content}>{content}</a>
            </output>
        )
    } else {
        return (
            <output>
                <>{content}</>
            </output>
        )
    }
}