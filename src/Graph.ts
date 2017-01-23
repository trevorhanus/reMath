import {observable, ObservableMap, computed, action, observe, IReactionDisposer} from 'mobx';
import {BaseCell, Options} from './BaseCell';
import * as messages from './Messages';
import {matchesIdFormat} from './utils/regex';

export class Graph {
  @observable private _cells: ObservableMap<BaseCell>;
  private _messages: messages.Messages;
  private _symbolToIdMap: ({[symbol: string]: string});

  constructor() {
    this._cells = observable.map<BaseCell>();
    this._messages = new messages.Messages();
    this._symbolToIdMap = {};
  }

  @computed
  get cells(): BaseCell[] {
    return this._cells.values();
  }

  find(symbolOrId: string): BaseCell {
    let cell: BaseCell;
    const probablyAnId = matchesIdFormat(symbolOrId);
    if (probablyAnId) {
      cell = this._cells.get(symbolOrId);
    }
    if (cell === undefined) {
      const id = this.getId(symbolOrId);
      cell = this._cells.get(id);
    }
    return cell;
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
  addCell(options: Options): BaseCell {
    const {symbol} = options;
    if (this.symbolExists(symbol)) {
      this._messages.add({
        type: messages.Type.ERROR,
        content: `Remath: symbol \`${symbol}\` already exists`
      });
      return;
    }
    const newCell = new BaseCell(options, this);
    this.mapSymbol(symbol, newCell.id);
    this._cells.set(newCell.id, newCell);
    return newCell;
  }

  @action
  removeCell(symbol: string) {
    const cell = this.find(symbol);
    if (!cell) {
      return;
    }

    const id = this.getId(symbol);
    if (this.cellIsReferencedByOthers(id)) {
      this._messages.add({
        type: messages.Type.WARNING,
        content: `Removing cell with symbol \`${symbol}\` whose value is referenced by other cells.`
      });
    }
    this._cells.delete(id);
    delete this._symbolToIdMap[symbol];
  }

  @computed
  get messages(): messages.Message[] {
    return this._messages.list;
  }

  @action
  removeMessage(id: string): void {
    this._messages.remove(id);
  }

  private cellIsReferencedByOthers(id: string): boolean {
    const cells = this._cells.values();
    return cells.some(cell => {
      return cell.dependsOn(id);
    });
  }

  getId(symbol: string): string {
    return this._symbolToIdMap[symbol];
  }

  public getSymbol(id: string): string {
    const cell = this._cells.get(id);
    if (cell) {
      return cell.symbol;
    } else {
      return null;
    }
  }

  private mapSymbol(symbol: string, id: string): void {
    this._symbolToIdMap[symbol] = id;
  }

  public updateSymbolToIdMap(oldSymbol: string, newSymbol: string): void {
    const id = this.getId(oldSymbol);
    this.mapSymbol(newSymbol, id);
    delete this._symbolToIdMap[oldSymbol];
  }
}
