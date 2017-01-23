import {observable, computed} from 'mobx';

export class CellError {
  @observable private _type: Type;
  @observable private _message: string;

  constructor(options: Options) {
    this._type = options.type;
    this._message = options.message;
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
  get type(): string {
    return this._type.toString();
  }
}

export interface Options {
  type: Type;
  message: string;
}

export enum Type {
  INVALID_SYMBOL,
  REF_NOT_FOUND,
  REF_CIRCULAR,
  INVALID_FORMULA,
  INVALID_VALUE
}

const ErrorTypeToDisplayValueMap: ({[index: string]: string}) = {
  '0': '#SYM!',
  '1': '#REF?',
  '2': '#CIRC!',
  '3': '#FORM!',
  '4': '#VAL!'
}
