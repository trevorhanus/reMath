import {autorun} from 'mobx';
import * as sinon from 'sinon';
import {Graph} from '../src/Graph';

describe('Boolean Cell', () => {
  it('can add a false cell', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a',
      value: '= false'
    });
    expect(a.value).toBe(false);
  });

  it('can add a true cell', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a',
      value: '= true'
    });
    expect(a.value).toBe(true);
    expect(a.displayValue).toBe('true');
  });

  it('can change value', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a',
      value: '= false'
    });
    a.setValue('= true');
    expect(a.value).toBe(true);
  });
});
