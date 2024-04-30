import {
    type ReadResult,
    readBarcodesFromImageFile,
    readBarcodesFromImageData,
} from "zxing-wasm/reader";

function reduceReadResults(accumulator: string, readResult: ReadResult): string {
    return accumulator + readResult.text;
}

async function wait(ms: number): Promise<void> {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

export default async function readQRCode(image: File | ImageData, delay?: number) {
    let recognition: ReadResult[];
    if (image instanceof File) {
        recognition = await readBarcodesFromImageFile(image);
    } else {
        recognition = await readBarcodesFromImageData(image)
    }
    if (delay) {
        await wait(delay); // without delay page takes all resorces and page close button must be clicked twice in order to be closed 
    }

    return recognition.reduce(reduceReadResults, "")
}