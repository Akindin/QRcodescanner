import { useEffect, useRef } from "react";
import debounce from "./../utils/debounce";


export default function FileInput({ onFileAccepted, onFileRejected }: { onFileAccepted: (image: File) => void, onFileRejected: (message: string) => void }) {
    type ValiditySuccess = {
        success: true
    }
    type ValidityError = {
        success: false,
        errorMessage: string
    }

    type ValidityReport = ValiditySuccess | ValidityError;

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownOverlayRef = useRef<HTMLDialogElement>(null);


    function getValidityReport(files: FileList): ValidityReport {
        let success: boolean = false;
        let errorMessage: string = "";

        if (files.length === 0) {
            errorMessage = "Ошибка!\nФайл не загружен.";
        } else if (files.length !== 1) {
            errorMessage = "Ошибка!\nМожно загрузить только один файл.";
        } else {
            const file = files.item(0);
            if (file!.size > 1024 ** 3 * 8) {
                errorMessage = "Ошибка!\nФайл слишком большой\nмаксимальный размер файла 32 Мб."
            } else {
                switch (file!.type) {
                    case "image/png":
                    case "image/jpeg":
                    case "image/jpg":
                        success = true;
                        break;
                    default:
                        errorMessage = "Ошибка!\nЗагруженый файл\nнекоррктного формата.";
                }
            }
        }


        if (errorMessage === "") {
            return { success } as { success: true };
        } else {
            return {
                success,
                errorMessage: errorMessage
            }
        }
    }

    function examineFiles(files: FileList | null | undefined) {
        if (files) {
            const validityReport = getValidityReport(files)
            if (validityReport.success) {
                /* files already validated to have exactly one item */
                onFileAccepted(files.item(0) as File);
            } else {
                inputRef.current!.value = "";
                onFileRejected(validityReport.errorMessage);
            }
        }
    }

    function handleChange() {
        /* 
            inputRef.current exists because function called
            only in input with ref={inputRef}
         */
        const files = inputRef.current!.files;
        examineFiles(files);
    }

    function dropHandler(event: DragEvent): void {
        event.preventDefault();
        dropdownOverlayRef.current?.close();
        const files = event.dataTransfer?.files;
        examineFiles(files);
    }

    const delayDropdownOverlay = debounce(function () {
        dropdownOverlayRef.current?.close();
    }, 100);

    function dragOverHandler(event: Event) {
        event.preventDefault();
        dropdownOverlayRef.current?.showModal();
        delayDropdownOverlay();
    }

    useEffect(() => {
        document.addEventListener('dragover', dragOverHandler);
        document.addEventListener('drop', dropHandler);

        return () => {
            document.removeEventListener('dragover', dragOverHandler);
            document.removeEventListener('drop', dropHandler);
        }
    }, [dropdownOverlayRef]);

    return (
        <>
            <label htmlFor="load_file" className="custom_button custom_load_file">Select a File</label>
            <input id="load_file" type="file" onChange={handleChange} ref={inputRef} hidden />
            <dialog ref={dropdownOverlayRef} className="dropdown_overlay">
                Drag and drop the file anywhere on the screen.
                Valid extensions: PNG, JPEG, JPG.
            </dialog>
        </>

    )
}