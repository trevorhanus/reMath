import * as sinon from 'sinon';
import {autorun, spy} from 'mobx';
import * as error from '../src/errors/CellError';
import {Graph} from '../src/Graph';

describe('Update Symbol', () => {
  it('can update a symbol when other cells depend on it', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a',
      value: '= 10'
    });
    const b = graph.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    const renderSpy = sinon.spy(() => {
      b.value;
    });
    autorun(renderSpy);
    // change a's symbol
    expect(b.formula).toBe('= a + 10');
    a.updateSymbol('a2');
    expect(b.value).toBe(20);
    expect(b.formula).toBe('= a2 + 10');
  });
});
