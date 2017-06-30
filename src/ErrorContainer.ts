import {observable, ObservableMap, computed, action} from "mobx";
import {ErrorType, IError} from './IError';

export interface IErrorContainer {
   valid: boolean;
   hasError: boolean;
   clearError: (type: ErrorType) => void;
   addError: (error: IError) => void;
   errors: IError[];
}

export class ErrorContainer implements IErrorContainer {
   @observable private _errors: ObservableMap<IError>;

   constructor() {
      this._errors = observable.map<IError>();
   }

   @computed
   get valid(): boolean {
      return this._errors.size === 0;
   }

   @computed
   get hasError(): boolean {
       return !this.valid;
   }

   @action
   clearError(type: ErrorType): void {
      this._errors.delete(ErrorType[type]);
   }

   @action
   addError(error: IError): void {
      this._errors.set(ErrorType[error.type], error);
   }

   @computed
   get errors(): IError[] {
      return this._errors.values();
   }
}
