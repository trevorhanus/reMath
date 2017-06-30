export enum ErrorType {
   CircularReference,
   ReferenceNotFound,
   InvalidSymbol,
   InvalidFormula,
   InvalidValue
}

export interface IError {
   type: ErrorType;
   message: string;
   displayValue: string;
}