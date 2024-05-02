type PreviewContent = {
    type: "file",
    content: File
} | {
    type: "error",
    content: string
} | {
    type: "stream",
    content: MediaStream
};

export default PreviewContent;