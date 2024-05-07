/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import debounce from "./../utils/debounce";
import load_file_icon from "./../img/load_file_icon.svg"

type ValidityReport = {
    success: boolean,
    errorMessage: string
};

export default function FileInput({ onFileAccepted, onFileRejected }: { onFileAccepted: (image: File) => void, onFileRejected: (message: string) => void }) {

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
                errorMessage = "Ошибка!\nФайл слишком большой\nмаксимальный размер файла 1 Гб."
            } else {
                const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

                if (allowedFileTypes.includes(file!.type)) {
                    success = true;
                } else {
                    errorMessage = "Ошибка!\nЗагруженый файл\nнекоррктного формата.";
                }
            }
        }

        return {
            success,
            errorMessage: errorMessage
        }
    }

    function examineFiles(files: FileList | null | undefined) {
        if (files) {
            const validityReport = getValidityReport(files)
            if (validityReport.success) {
                /* files already validated to have exactly one item */
                onFileAccepted(files.item(0)!);
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
    }, [dragOverHandler, dropHandler, dropdownOverlayRef]);

    return (
        <>
            <label htmlFor="load_file" className="button">
                <img src={load_file_icon} alt="" />
                Загрузить файл</label>
            <input id="load_file" type="file" onChange={handleChange} ref={inputRef} hidden />
            <dialog ref={dropdownOverlayRef} className="dropdown_overlay">
                Перетащите файл в любое место экрана.
                <br />
                Допустимые расширения: PNG, JPEG, JPG.
            </dialog>
        </>

    )
}