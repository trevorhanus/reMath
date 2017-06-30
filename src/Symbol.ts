import {Node, INodeState} from './Node';
import {hasher} from './utils/Hasher';
import {Remath} from './Remath';
import {ErrorType, IError} from './IError';
import {observable, computed, action} from "mobx";
import {isValidSymbol} from "./utils/regex";
import {isNullOrUndefined} from "util";

export interface ISymbol {
   symbol: string;
   updateSymbol: (symbol: string) => void; // throws when symbol is invalid
}

export interface ISymbolState extends INodeState {
   symbol: string;
}

export class Symbol extends Node implements ISymbol {
   @observable private _symbol: string;
   @observable private _tempInvalidSymbol: string;

   constructor(graph: Remath, initialState: ISymbolState) {
      super(graph, initialState);
      this._symbol = null;
      if (!initialState || isNullOrUndefined(initialState.symbol)) throw Error('must provide a symbol when creating a cell');
      this.updateSymbol(initialState.symbol);
      this._tempInvalidSymbol = null;
   }

   @computed
   get symbol(): string {
      return this._tempInvalidSymbol === null ? this._symbol : this._tempInvalidSymbol;
   }

   @action
   updateSymbol(symbol: string): void {
      // start fresh
      this._tempInvalidSymbol = null;
      this.clearError(ErrorType.InvalidSymbol);

      symbol = symbol.trim();

      // make sure symbol is valid
      if (!isValidSymbol(symbol)) {
         this._tempInvalidSymbol = symbol;
         this.throwInvalidSymbolError(`[${symbol}] is an invalid symbol. Symbols must start with a letter and may only contain word characters`);
         return;
      }

      // make sure symbol does not already exist
      if (this.graph.symbolExists(symbol)) {
         this._tempInvalidSymbol = symbol;
         this.throwInvalidSymbolError(`${symbol} already exists. Can not have two variables with the same symbol.`);
         return;
      }

      // finally, set new symbol
      if (this._symbol === null) {
         hasher.set(symbol, this.id);
      } else {
         hasher.swapKeys(this._symbol, symbol);
      }

      this._symbol = symbol;
   }

   @action
   private throwInvalidSymbolError(message: string): void {
      const error: IError = {
         type: ErrorType.InvalidSymbol,
         message: message,
         displayValue: '#SYM!'
      };
      this.addError(error);
   }
}