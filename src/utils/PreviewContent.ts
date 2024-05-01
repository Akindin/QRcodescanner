type PreviewContent = {
    type: "file",
    content: File
} | {
    type: "error",
    content: string
};

export default PreviewContent;