import {BaseCell} from '../src/BaseCell';
import {Graph} from '../src/Graph';

describe('Base Cell', () => {

  it('generates an id on instantiation', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    expect(cell.id).toBeTruthy();
  });

  it('sets the symbol on instantiation', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    expect(cell.symbol).toBe('a');
  });

  it('sets error when symbol includes a number for the first character', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: '9'
    }, graph);
    expect(cell.symbol).toBe('9');
    expect(cell.hasError).toBe(true);
    expect(cell.errorMessage).toBe('[9] is an invalid symbol');
  });

  it('no error when symbol includes a non-number first character', () => {
    const graph = new Graph();
    const cell = graph.addCell({
      symbol: 'a_9'
    });
    expect(cell.symbol).toBe('a_9');
    expect(cell.hasError).toBe(false);
  });

  it('sets error when symbol is blank', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: ''
    }, graph);
    expect(cell.hasError).toBe(true);
    expect(cell.errorMessage).toBe('[] is an invalid symbol');
  });

  it('sets error when symbol has space', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'with space'
    }, graph);
    expect(cell.hasError).toBe(true);
    expect(cell.errorMessage).toBe('[with space] is an invalid symbol');
  });

  it('clears error when valid symbol is set', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: '9'
    }, graph);
    expect(cell.hasError).toBe(true);
    cell.updateSymbol('a');
    expect(cell.hasError).toBe(false);
    expect(cell.errorMessage).toBeNull();
  });

  it('defaults to unlocked', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    expect(cell.locked).toBe(false);
  });

  it('can instantiate locked', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a',
      locked: true
    }, graph);
    expect(cell.locked).toBe(true);
  });

  it('can lock', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    cell.lock();
    expect(cell.locked).toBe(true);
  });

  it('can unlock', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a',
      locked: true
    }, graph);
    expect(cell.locked).toBe(true);
    cell.unlock();
    expect(cell.locked).toBe(false);
  });

  it('can set value', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a',
      value: '= 10'
    }, graph);
    cell.setValue('= 11');
    expect(cell.value).toBe(11);
  });

  it('cannot set value when locked', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a',
      value: '= 10',
      locked: true
    }, graph);
    cell.setValue('= 11');
    expect(cell.value).toBe(10);
  });
});
