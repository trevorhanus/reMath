import * as sinon from 'sinon';
import {CellErrorType} from '../src/CellError';
import Remath from '../src';

describe('Circular Reference', () => {
  it('catches a simple circular reference', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      value: '= 10'
    });
    a.setValue('= a')
  });

  it('catches a complicated circular reference', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      value: '= 10'
    });
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
      value: '= c + b'
    });
    c.setValue('= d + a');
    expect(c.hasError).toBe(true);
    expect(c.error.type).toBe(CellErrorType.REF_CIRCULAR);
    expect(c.displayValue).toBe('#CIRC!');
  });
});
