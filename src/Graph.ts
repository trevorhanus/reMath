import {observable, ObservableMap, computed, action, observe, IReactionDisposer} from 'mobx';
import hasher from './utils/Hasher';
import {BaseCell, Options} from './BaseCell';
import * as messages from './Messages';
import {matchesIdFormat} from './utils/regex';

export class Graph {
  @observable private _cells: ObservableMap<BaseCell>;
  private _messages: messages.Messages;

  constructor() {
    this._cells = observable.map<BaseCell>();
    this._messages = new messages.Messages();
  }

  @computed
  get cells(): BaseCell[] {
    return this._cells.values();
  }

  public find(symbolOrHash: string): BaseCell {
    let cell: BaseCell;
    const probablyAnId = matchesIdFormat(symbolOrHash);
    if (probablyAnId) {
      cell = this._cells.get(symbolOrHash);
    }
    if (cell === undefined) {
      const hash = hasher.getHash(symbolOrHash);
      cell = this._cells.get(hash) || null;
    }
    return cell;
  }

  symbolExists(symbol: string): boolean {
    const hash = hasher.getHash(symbol);
    return this._cells.has(hash);
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
    this._cells.set(newCell.hash, newCell);
    return newCell;
  }

  @action
  removeCell(symbol: string) {
    const cell = this.find(symbol);
    if (!cell) {
      return;
    }

    const hash = hasher.getHash(symbol);
    if (this.cellIsReferencedByOthers(hash)) {
      this._messages.add({
        type: messages.Type.WARNING,
        content: `Removing cell with symbol \`${symbol}\` whose value is referenced by other cells.`
      });
    }
    this._cells.delete(hash);
  }

  @computed
  get messages(): messages.Message[] {
    return this._messages.list;
  }

  @action
  removeMessage(id: string): void {
    this._messages.remove(id);
  }

  private cellIsReferencedByOthers(hash: string): boolean {
    const cells = this._cells.values();
    return cells.some(cell => {
      return cell.dependsOn(hash);
    });
  }

  public getSymbol(hash: string): string {
    const cell = this._cells.get(hash);
    if (cell) {
      return cell.symbol;
    } else {
      return null;
    }
  }
}
