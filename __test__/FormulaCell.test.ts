import {autorun} from 'mobx';
import * as sinon from 'sinon';
import Remath from '../src';
import * as math from 'mathjs';

describe('Formula Cell', () => {

  it('instantiates', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a'
    });
    a.setValue('b + c + 10');
    expect(a.symbol).toBe('a');
  });

  it('boolean', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      value: '= true'
    });
    expect(a.value).toBe(true);
    expect(a.displayValue).toBe('true');
  });

  it('knows when it has dependents', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a'
    });
    a.setValue('= b + c + 10');
    expect(a.hasDependents).toBe(true);
  });

  it('knows when it depends on a symbol', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a'
    });
    a.setValue('= b + c + 10');
    expect(a.dependsOn('b')).toBe(true);
    expect(a.dependsOn('c')).toBe(true);
    expect(a.dependsOn('not')).toBe(false);
  });

  it('updates value when dependent value changes', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a'
    });
    a.setValue('10');
    const b = remath.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    const renderSpy = sinon.spy(() => {
      b.value;
    });
    autorun(renderSpy);
    a.setValue('11');
    expect(renderSpy.callCount).toBe(2);
    expect(b.value).toBe(21);
  });

  it('Can add `b = a + 10` when `a` does not exist', () => {
    const remath = new Remath();
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
    const remath = new Remath();

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

  it('can find a circular reference', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      value: '= 10'
    });
    a.setValue('= a');
    const b = remath.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    const c = remath.addCell({
      symbol: 'c',
      value: '= b + a'
    });
    const d = remath.addCell({
      symbol: 'd',
      value: '= c + a'
    });
    c.setValue('d + a');
  });

  it('can update a symbol when other cells depend on it', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'temp',
      value: '= 10'
    });
    const b = remath.addCell({
      symbol: 'b',
      value: '= temp + 10'
    });

    a.setSymbol('a');
  });
});
