import {autorun} from 'mobx';
import * as sinon from 'sinon';
import {CellErrorType} from '../src/CellError';
import Remath from '../src';

describe('Reference Not Found', () => {
  it('simple reference does not exist', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      value: '= 10'
    });
    a.setValue('= b + 10');
    expect(a.displayValue).toBe('#REF?');
    expect(a.value).toEqual(NaN);
  });

  it('reference is removed', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      value: '= 10'
    });
    const b = remath.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    expect(b.value).toBe(20);

    // remove a from sheet
    remath.removeCell('a');
    expect(b.value).toEqual(NaN);
    expect(b.displayValue).toEqual('#REF?');
  });

  it('rerenders when reference is removed', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      value: '= 10'
    });
    const b = remath.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    const renderSpy = sinon.spy(() => {
      b.displayValue;
    });
    autorun(renderSpy);
    remath.removeCell('a');
    const expectedCallCount = 3;
     // 1) when autorun is executed for the first time
     // 2) when value changes to NaN because `b` can't find the value of `a`
     // 3) when the `watchForErrorInValue` reaction sees that the value is NaN
     // and adds an error to the cell
    expect(renderSpy.callCount).toBe(expectedCallCount);
  });
});
