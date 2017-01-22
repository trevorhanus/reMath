import * as sinon from 'sinon';
import {autorun, spy} from 'mobx';
import {CellErrorType} from '../src/CellError';
import Remath from '../src';

describe('Update Symbol', () => {
  it('can update a symbol when other cells depend on it', () => {
    spy((event) => {
      if (event.type === 'reaction') {
        console.log(`${event.object} with args: ${event.fn}`)
      }
    });
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
      console.log(b.value);
    });
    autorun(renderSpy);

    // change a's symbol
    a.setSymbol('a2');
    expect(b.value).toBe(20);
  });
});
