import {autorun} from 'mobx';
import * as sinon from 'sinon';
import Remath from '../src';
import {BooleanCell} from '../src/BooleanCell';

describe('Formula Cell', () => {
  it('can add boolean cell', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      value: '= false'
    });
    expect(a.value).toBe(false);
  });

  it('can change value', () => {
    const remath = new Remath();
    const a = remath.addCell({
      symbol: 'a',
      value: '= false'
    });
    a.setValue('= true');
    expect(a.value).toBe(true);
  });
});
