import {Cell, CellState} from './Cell';
import {matchesIdFormat} from './utilities/regex';
import {hasher} from './utilities/Hasher';
import {observable, ObservableMap, computed, action} from "mobx";

export interface IRemath {
   addCell: (state: CellState) => Cell;
   cells: Cell[];
   find: (symbolOrId: string) => Cell;
   symbolExists: (symbol: string) => boolean;
   removeCell: (symbolOrId: string) => Cell;
}

export class Remath implements IRemath {
   @observable private _cells: ObservableMap<Cell>;

   constructor() {
      this._cells = observable.map<Cell>();
   }

   @computed
   get cells(): Cell[] {
      return this._cells.values();
   }

   find(symbolOrId: string): Cell {
      let cell: Cell;
      const probablyAnId = matchesIdFormat(symbolOrId);
      if (probablyAnId) {
         cell = this._cells.get(symbolOrId);
      }
      if (cell === undefined) { // maybe it is a symbol
         const hash = hasher.getHash(symbolOrId);
         cell = this._cells.get(hash) || null;
      }
      return cell;
   }

   symbolExists(symbol: string): boolean {
      return this._cells.values().some(cell => {
         return cell.symbol === symbol;
      });
   }

   hasCell(id: string): boolean {
      return this._cells.has(id);
   }

   @action
   addCell(state: CellState): Cell {
      const newCell = new Cell(this, state);
      this._cells.set(newCell.id, newCell);
      return newCell;
   }

   @action
   removeCell(symbolOrId: string): Cell {
      const cell = this.find(symbolOrId);
      if (!cell) return;

      // remove reference to this node in all dependent nodes
      cell.dependents.forEach(node => {
         node.removeProvider(cell);
      });

      // delete node from graph
      this._cells.delete(cell.id);
      return cell;
   }
}
