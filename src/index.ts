import {Graph} from './Graph';
import {BaseCell, Options} from './BaseCell';
import {Message} from './Messages';

export default class Remath {
  private _graph: Graph;

  constructor() {
    this._graph = new Graph();
  }

  public find(symbolOrId: string): BaseCell {
    return this._graph.find(symbolOrId);
  }

  public symbolExists(symbol: string): boolean {
    return this._graph.symbolExists(symbol);
  }

  public addCell(options: AddCellOptions): BaseCell {
    return this._graph.addCell(options);
  }

  public removeCell(symbol: string): void {
    this._graph.removeCell(symbol);
  }

  public get messages(): Message[] {
    return this._graph.messages;
  }

  public removeMessage(id: string): void {
    this._graph.removeMessage(id);
  }

  public fromJSON(calcJSON: any) {
    calcJSON.cells.forEach((cellJSON: Options) => {
      this.addCell(cellJSON)
    });
  }
}

export interface AddCellOptions extends Options {}
