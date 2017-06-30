import {INode} from './Node';
import {IErrorContainer} from "./ErrorContainer";
import {ISymbol} from "./Symbol";
import {IFormula, Formula, IFormulaState} from "./Formula";
import {ILockable} from "./Lockable";

export class Cell extends Formula {}

namespace Cell {

   export interface Cell extends
      IErrorContainer,
      ILockable,
      INode,
      ISymbol,
      IFormula {}

}

export interface CellState extends IFormulaState {}
