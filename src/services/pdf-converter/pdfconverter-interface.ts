import { PdfOptions } from "./pdfoptions";

export interface PdfConverter{
    convert(options :PdfOptions);
}