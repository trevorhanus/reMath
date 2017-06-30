import {observable, action, computed, reaction, autorun} from 'mobx';
import * as math from 'mathjs';
import {ErrorType, IError} from './IError';
import {cleanFormula} from "./utils/regex";
import {Cell} from './Cell';
import {Remath} from './Remath';
import {Symbol, ISymbolState} from "./Symbol";
import {IErrorContainer} from "./ErrorContainer";

export interface ISymbolNode extends mathjs.MathNode {
   cell: Cell;
}

export interface IScope {
   [symbol: string]: number;
}

export interface IFormula {
   setFormula: (formula: string) => void; // throws when formula is invalid
   formula: string;
   value: number;
   displayValue: string;
}

export interface IFormulaState extends ISymbolState {
   formula?: string;
}

export class Formula extends Symbol implements IFormula {
   @observable.ref private _rootNode: mathjs.MathNode;
   @observable private _tempInvalidFormula: string;

   constructor(graph: Remath, initialState: IFormulaState) {
      super(graph, initialState);
      this._rootNode = null;
      this._tempInvalidFormula = null;
      const formula = initialState.formula || '';
      this.setFormula(formula);
      this.watchProvidersForChanges();
   }

   @computed
   get formula(): string {
      if (this._tempInvalidFormula !== null) {
         return this._tempInvalidFormula;
      }

      if (this._rootNode === null) {
         return '';
      }

      return this._rootNode.toString();
   }

   @action
   setFormula(formula: string): void {
      if (formula === '') {
         return;
      }

      // start fresh
      this._tempInvalidFormula = null;
      this.clearErrors();

      const newFormula = cleanFormula(formula);

      // use the mathjs library to parse the formula and make sure it is valid
      const rootNode = this.createNodeTree(newFormula);
      if (rootNode === null) {
         // formula was not valid
         this._tempInvalidFormula = newFormula;
         return;
      }

      // now we need to update this cell's dependencies
      this.updateDependencies(rootNode);

      // finally set the rootNode
      this._rootNode = rootNode;
   }

   @computed
   get value(): number {
      if (this._rootNode === null || !this.valid) {
         return NaN;
      }

      try {
         return this._rootNode.eval(this.scope);
      } catch (e) {
         return NaN;
      }
   }

   // TODO: implement numeraljs for the display value. should be able to set a mask
   // and then pass the value through the mask
   @computed
   get displayValue(): string {
       if (!this.valid) {
           return this.errors[0].displayValue;
       }
       return this.value.toString();
   }

   @computed
   get scope(): IScope {
      const scope: IScope = {};
      this.symbolNodes.forEach((node: ISymbolNode) => {

         if (!node.cell || isNaN(node.cell.value)) {
            // this.addCellReferenceError(`[${node.cell.symbol}] has an error`);
            throw {};
         }

         if (!this.graph.hasCell(node.cell.id)) {
            // cell was deleted
            // this.addCellReferenceError(`[${node.cell.symbol}] was deleted`);
            throw {};
         }

         const value = node.cell.value;
         const symbol = node.cell.symbol;
         // make sure the node has the same symbol
         node.name = symbol;
         scope[symbol] = value;
      });
      return scope;
   }

   @computed
   private get symbolNodes(): ISymbolNode[] {
      if (this._rootNode === null) return [];

      return this._rootNode.filter((node: mathjs.MathNode) => {
         return node.isSymbolNode;
      }) as ISymbolNode[];
   }

   @action
   private createNodeTree(formula: string): mathjs.MathNode {
      let rootNode: mathjs.MathNode = null;
      try {
         rootNode = math.parse(formula);
         return rootNode;
      } catch (e) {
         this.addInvalidFormula(e.message);
         return rootNode;
      }
   }

   @action
   private updateDependencies(rootNode: mathjs.MathNode): void {
      // remove all previous dependencies
      this.clearDependencies();

      // find the referenced cell for each symbol node
      rootNode.filter(node => node.isSymbolNode).forEach((symbolNode: ISymbolNode) => {
         if (this.symbol === symbolNode.name) {
            this.addCellReferenceError(`[${this.symbol}]'s formula references itself.`);
            return;
         }

         const provider = this.graph.find(symbolNode.name);

         if (provider === null) {
            // we couldn't find a cell with the given symbol
            // need to throw a reference error
            this.addCellReferenceError(`${this.symbol}'s formula references ${symbolNode.name} which does not exist.`);
            return;
         }

         symbolNode.cell = provider;

         try {
            // attempt to add dependency
            this.addDependency(provider);
         } catch (e) {
            this.addCellReferenceError('Circular reference detected.');
         }
      });
   }

   @action
   private clearErrors(): void {
      this.clearError(ErrorType.InvalidFormula);
      this.clearError(ErrorType.CircularReference);
      this.clearError(ErrorType.ReferenceNotFound);
   }

   @action
   private addInvalidFormula(message: string): void {
      const error: IError = {
         type: ErrorType.InvalidFormula,
         message: message,
         displayValue: '#FORM!'
      };
      this.addError(error);
   }

   @action
   private addCellReferenceError(message: string): void {
      const error: IError = {
         type: ErrorType.ReferenceNotFound,
         message: message,
         displayValue: '#REF?'
      };
      this.addError(error);
   }

   private watchProvidersForChanges(): void {
      reaction(() => {
         if (isNaN(this.value)) {
            return NaN;
         }
      }, (value) => {
         this.symbolNodes.forEach((node: ISymbolNode) => {

            if (!node.cell || isNaN(node.cell.value)) {
               this.addCellReferenceError(`[${node.name}] has an error`);
               return;
            }

            if (!this.graph.hasCell(node.cell.id)) {
               // cell was deleted
               this.addCellReferenceError(`referenced cell [${node.cell.symbol}] was deleted`);
            }
         });
      });
   }
}