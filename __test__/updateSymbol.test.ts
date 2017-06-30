import * as sinon from 'sinon';
import {autorun, spy} from 'mobx';
import {Remath} from '../src';

describe('Update Symbol', () => {
  it('can update a symbol when other cells depend on it', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      formula: '= 10'
    });
    const b = remath.addCell({
      symbol: 'b',
      formula: '= a + 10'
    });
    const renderSpy = sinon.spy(() => {
      b.value;
    });
    autorun(renderSpy);
    // change a's symbol
    expect(b.formula).toBe('a + 10');
    a.updateSymbol('a2');
    expect(b.value).toBe(20);
    expect(b.formula).toBe('a2 + 10');
  });
});
