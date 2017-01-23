import {autorun} from 'mobx';
import * as sinon from 'sinon';
import * as error from '../src/errors/CellError';
import {Graph} from '../src/Graph';

describe('Reference Not Found', () => {
  it('simple reference does not exist', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a',
      value: '= 10'
    });
    a.setValue('= b + 10');
    expect(a.displayValue).toBe('#REF?');
    expect(a.value).toEqual(NaN);
  });

  it('reference is removed', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a',
      value: '= 10'
    });
    const b = graph.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    expect(b.value).toBe(20);

    // remove a from sheet
    graph.removeCell('a');
    expect(b.value).toEqual(NaN);
    expect(b.displayValue).toEqual('#REF?');
  });

  it('rerenders when reference is removed', () => {
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
      b.displayValue;
    });
    autorun(renderSpy);
    graph.removeCell('a');
    const expectedCallCount = 3;
     // 1) when autorun is executed for the first time
     // 2) when value changes to NaN because `b` can't find the value of `a`
     // 3) when the `watchForErrorInValue` reaction sees that the value is NaN
     // and adds an error to the cell
    expect(renderSpy.callCount).toBe(expectedCallCount);
  });
});
