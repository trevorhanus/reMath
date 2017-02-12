export declare class CellError {
    private _type;
    private _message;
    constructor(options: Options);
    readonly displayValue: string;
    readonly message: string;
    readonly type: string;
}
export interface Options {
    type: Type;
    message: string;
}
export declare enum Type {
    INVALID_SYMBOL = 0,
    REF_NOT_FOUND = 1,
    REF_CIRCULAR = 2,
    INVALID_FORMULA = 3,
    INVALID_VALUE = 4,
}
