import PreviewContent from "./../utils/PreviewContent";

export default function Preview({ previewContent }: { previewContent: PreviewContent | undefined }) {
    if (!previewContent) {
        return (
            <section className="preview">
                <p>
                    Чтобы отсканировать QR-код, пожалуйста, загрузите, либо перетяните файл с изображением или включите камеру на вашем устройстве. Допустимые расширения файлов: PNG, JPEG, JPG.
                </p>
            </section>
        )
    }

    switch (previewContent.type) {
        case "error":
            return (
                <section className="preview">
                    <p>
                        {previewContent.content}
                    </p>
                </section>
            )
        case "file":
            const imageSrc = URL.createObjectURL(previewContent.content);

            return (
                <section className="preview">
                    <img src={imageSrc} alt="Загруженное изображение" />
                </section>
            )
    }

}