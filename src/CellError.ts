import {observable, computed} from 'mobx';

export class CellError {
  @observable private _type: CellErrorType;
  @observable private _message: string;

  constructor() {
    this._type = null;
    this._message = null;
  }

  @computed
  get displayValue(): string {
    const index = this._type;
    return ErrorTypeToDisplayValueMap[index];
  }

  @computed
  get message(): string {
    return this._message;
  }

  @computed
  get type(): CellErrorType {  
    return this._type;
  }

  set(error: ErrorJSON) {
    this._type = error.type;
    this._message = error.message;
  }

  clear(): void {
    this._type = null;
    this._message = null;
  }
}

export interface ErrorJSON {
  type: CellErrorType;
  message: string;
}

export enum CellErrorType {
  INVALID_SYMBOL,
  REF_NOT_FOUND,
  REF_CIRCULAR
}

const ErrorTypeToDisplayValueMap: ({[index: string]: string}) = {
  '0': '#SYM!',
  '1': '#REF?',
  '2': '#CIRC!'
}
