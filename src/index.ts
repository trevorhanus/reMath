import {observable, ObservableMap, computed, action} from 'mobx';
import {Cell, Options} from './Cell';
import * as messages from './Messages';

export default class Remath {
  @observable private _cells: ObservableMap<Cell>;
  private _messages: messages.Messages;
  private _symbolToIdMap: ({[symbol: string]: string});

  constructor() {
    this._cells = observable.map<Cell>();
    this._messages = new messages.Messages();
    this._symbolToIdMap = {};
  }

  @computed
  get cells(): Cell[] {
    return this._cells.values();
  }

  find(symbol: string): Cell {
    const id = this.getId(symbol);
    return this._cells.get(id);
  }

  findById(id: string): Cell {
    return this._cells.get(id);
  }

  symbolExists(symbol: string): boolean {
    const id = this.getId(symbol);
    return this._cells.has(id);
  }

  @action
  fromJSON(calcJSON: any) {
    // add cells
    calcJSON.cells.forEach((cellJSON: Options) => {
      this.addCell(cellJSON)
    });
  }

  @action
  addCell(options: Options): Cell {
    const {symbol} = options;
    if (this.symbolExists(symbol)) {
      this._messages.add({
        type: messages.Type.ERROR,
        content: `Remath: symbol \`${symbol}\` already exists`
      });
      return;
    }
    const newCell = new Cell(options, this);
    this.setId(symbol, newCell.id);
    this._cells.set(newCell.id, newCell);
    return newCell;
  }

  @action
  removeCell(symbol: string) {
    const cell = this.find(symbol);
    if (!cell) {
      return;
    }

    if (this.cellIsReferencedByOthers(symbol)) {
      this._messages.add({
        type: messages.Type.WARNING,
        content: `Removing cell with symbol \`${symbol}\` whose value is referenced by other cells.`
      });
    }
    const id = this.getId(symbol);
    this._cells.delete(id);
  }

  @computed
  get messages(): messages.Message[] {
    return this._messages.list;
  }

  @action
  removeMessage(id: string): void {
    this._messages.remove(id);
  }

  private cellIsReferencedByOthers(symbol: string): boolean {
    const cells = this._cells.values();
    return cells.some(cell => {
      return cell.dependsOn(symbol);
    });
  }

  getId(symbol: string): string {
    return this._symbolToIdMap[symbol];
  }

  private setId(symbol: string, id: string): void {
    this._symbolToIdMap[symbol] = id;
  }

  public updateSymbolToIdMap(oldSymbol: string, newSymbol: string): void {
    const id = this.getId(oldSymbol);
    this.setId(newSymbol, id);
  }
}
