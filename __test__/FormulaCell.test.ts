import {autorun} from 'mobx';
import * as sinon from 'sinon';
import * as error from '../src/errors/CellError';
import {Graph} from '../src/Graph';

describe('Formula Cell', () => {
  it('instantiates', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    expect(a.symbol).toBe('a');
  });

  it('knows when it has dependents', () => {
    const remath = new Graph();
    const a = remath.addCell({
      symbol: 'a'
    });
    a.setValue('= b + c + 10');
    expect(a.hasDependencies).toBe(true);
  });

  it('knows when it depends on a symbol', () => {
    const remath = new Graph();
    const a = remath.addCell({
      symbol: 'a'
    });
    a.setValue('= b + c + 10');
    expect(a.dependsOn('b')).toBe(true);
    expect(a.dependsOn('c')).toBe(true);
    expect(a.dependsOn('not')).toBe(false);
  });

  it('evaluates', () => {
    const remath = new Graph();
    const a = remath.addCell({
      symbol: 'a'
    });
    a.setValue('= 10');
    const b = remath.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    expect(b.value).toBe(20);
  });

  it('updates value when dependent value changes', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    a.setValue('= 10');
    const b = graph.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    const renderSpy = sinon.spy(() => {
      b.value;
    });
    autorun(renderSpy);
    a.setValue('= 11');
    expect(renderSpy.callCount).toBe(2);
    expect(b.value).toBe(21);
  });

  it('Can add `b = a + 10` when `a` does not exist', () => {
    const remath = new Graph();
    // add b = a + 10
    const b = remath.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    expect(b.value).toEqual(NaN);
    expect(b.hasError).toBe(true);

    // add a = 10
    const a = remath.addCell({
      symbol: 'a',
      value: '= 10'
    });
    expect(b.value).toBe(20);
  });

  it('re-renders `b = a + 10` when `a` is added to sheet', () => {
    const remath = new Graph();

    // add b which depends on a, but a does not exist
    const b = remath.addCell({
      symbol: 'b',
      value: '= a + 10'
    });

    // set up render spy
    const renderSpy = sinon.spy(() => {
      b.value;
    });
    autorun(renderSpy);

    // add a, should re-render
    const a = remath.addCell({
      symbol: 'a',
      value: '= 10'
    });
    expect(renderSpy.callCount).toBe(2);

    // add c, which is independent, should not render
    const c = remath.addCell({
      symbol: 'c',
      value: '= 100'
    });
    expect(renderSpy.callCount).toBe(2);
  });
});
