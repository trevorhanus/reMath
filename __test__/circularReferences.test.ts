import * as sinon from 'sinon';
import * as error from '../src/errors/CellError';
import {Graph} from '../src/Graph';

describe('Circular Reference', () => {
  it('catches a simple circular reference', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a',
      value: '= 10'
    });
    a.setValue('= a')
    expect(a.displayValue).toBe('#CIRC!');
  });

  it('catches a complicated circular reference', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a',
      value: '= 10'
    });
    const b = graph.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    const c = graph.addCell({
      symbol: 'c',
      value: '= b'
    });
    const d = graph.addCell({
      symbol: 'd',
      value: '= c'
    });
    a.setValue('= d');
    expect(a.hasError).toBe(true);
    expect(a.displayValue).toBe('#CIRC!');
  });
});
