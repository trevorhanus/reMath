import {observable, ObservableMap, autorun, runInAction} from 'mobx';
import {Remath, Cell} from '../src';
import * as sinon from 'sinon';

function renderCells(remath: Remath, view: any): any {
  remath.cells.forEach(cell => {
    view.set(cell.symbol, renderCell(cell));
  });
}

function renderCell(cell: Cell): string {
  return `sym:${cell.symbol},formula:${cell.formula},val:${cell.value},disp:${cell.displayValue}`;
}

describe('Sessions', () => {

  it('mobx reacts when a previously not set key is set', () => {
    const map: ObservableMap<string> = observable.map<string>();
    map.set('b', 'value b');

    let view;
    const renderA = sinon.spy(() => {
      view = map.get('a');
    });
    autorun(renderA);
    expect(view).toBeUndefined();
    expect(renderA.callCount).toBe(1);
    
    map.set('c', 'value c');
    expect(renderA.callCount).toBe(1);

    map.set('a', 'value a');
    expect(view).toBe('value a');
    expect(renderA.callCount).toBe(2);
  });

  it('reacts to changing values', () => {
    const remath = new Remath();
    let view: ObservableMap<string> = observable.map<string>();
    autorun(() => {
      renderCells(remath, view);
    });

    // add a
    runInAction(() => {
      const a = remath.addCell({
        symbol: 'a',
        formula: '= 10'
      });
    });
    expect(view.get('a')).toBe('sym:a,formula:10,val:10,disp:10');

    // add b
    runInAction(() => {
      const b = remath.addCell({
        symbol: 'b',
        formula: '= a + 10'
      });
    });
    expect(view.get('a')).toBe('sym:a,formula:10,val:10,disp:10');
    expect(view.get('b')).toBe('sym:b,formula:a + 10,val:20,disp:20');

    // change a
    runInAction(() => {
      remath.find('a').setFormula('= 20');
    });
    expect(view.get('a')).toBe('sym:a,formula:20,val:20,disp:20');
    expect(view.get('b')).toBe('sym:b,formula:a + 10,val:30,disp:30');
  });

  it('Adding variable whose formula references a non-existent symbol', () => {
    const remath = new Remath();
    let view: ObservableMap<string> = observable.map<string>();
    const render = sinon.spy(() => {
      renderCells(remath, view);
    });
    autorun(render);

    // add a
    const a = remath.addCell({
      symbol: 'a',
      formula: '= b + 10'
    });
    expect(render.callCount).toBe(2);
    expect(view.get('a')).toBe('sym:a,formula:b + 10,val:NaN,disp:#REF?');

    // add b = 30
    runInAction(() => {
      const b = remath.addCell({
        symbol: 'b',
        formula: '=30'
      });
    });
    expect(view.get('b')).toBe('sym:b,formula:30,val:30,disp:30');
    expect(view.get('a')).toBe('sym:a,formula:b + 10,val:40,disp:40');
  });
});
