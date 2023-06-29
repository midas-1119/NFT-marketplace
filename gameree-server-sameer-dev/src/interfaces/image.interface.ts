export interface IGeneric {
    [key: string]: any;
}
export interface IUploadImage {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: any;
    size: number;
}
