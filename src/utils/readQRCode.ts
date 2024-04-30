import {
    type ReadResult,
    readBarcodesFromImageFile,
    readBarcodesFromImageData,
} from "zxing-wasm/reader";

function reduceReadResults(accumulator: string, readResult: ReadResult): string {
    return accumulator + readResult.text;
}

export default async function readQRCode(image: File | ImageData) {
    let recognition: ReadResult[];
    if (image instanceof File) {
        recognition = await readBarcodesFromImageFile(image);
    } else {
        recognition = await readBarcodesFromImageData(image)
    }
    console.log(recognition);
    return recognition.reduce(reduceReadResults, "")
}