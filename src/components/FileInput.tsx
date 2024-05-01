import { useEffect, useRef } from "react";
import debounce from "./../utils/debounce";
import logo from '../img/logo512.png';



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
        <header>
            <img src={logo} alt="QR Code Scanner"/>

                <div className="logo">
                    <p className="logo-text"> QR Code Scanner </p>
                </div>
               
        </header>
        <main>
            <section id="input_box">
                <p>
                In order to scan the QR code, please select the file on your computer or turn on the camera on your device.
                </p>
            </section>
            <div id="buttons">
                <label htmlFor="load_file" id="custom_load_file" className="custom_button">Select a File</label>
                <input id="load_file" type="file" onChange={handleChange} ref={inputRef} style={{ display: 'none' }} />

                <label htmlFor="open_camera" id="custom_open_camera" className="custom_button">Open Camera</label>
                <input id="open_camera" type="file" onChange={handleChange} ref={inputRef} style={{ display: 'none' }} />

            </div>

            <section id="output_box"> 
                <p>
                This field will contain information retrieved from the scanned QR code.
                </p>
            </section>

            <dialog ref={dropdownOverlayRef} className="dropdown_overlay">
                Drag and drop the file anywhere on the screen
            </dialog>


        </main>
        <footer>
            <p>&copy; ITPelag 2024 // made by <a href="https://github.com/Akindin">Viktor Kudin</a> and <a href="https://github.com/noidoRG">Rodion Gladyshev</a> </p>
        </footer>
        </>

    )
}