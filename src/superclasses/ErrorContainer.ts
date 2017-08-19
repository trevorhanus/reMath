import {observable, ObservableMap, computed, action} from "mobx";
import {ErrorType, IError} from '../IError';

export interface IErrorContainer {
    valid: boolean;
    hasError: boolean;
    errors: IError[];
    __clearError: (type: ErrorType) => void;
    __addError: (error: IError) => void;
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
    __clearError(type: ErrorType): void {
        this._errors.delete(ErrorType[type]);
    }

    @action
    __addError(error: IError): void {
        this._errors.set(ErrorType[error.type], error);
    }

    @computed
    get errors(): IError[] {
        return this._errors.values();
    }
}
