import {Cell} from '../src/Cell';
import Remath from '../src/';

describe('Base Cell', () => {

  it('generates an id on instantiation', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'a'
    }, remath);
    expect(cell.id).toBeTruthy();
  });

  it('sets the symbol on instantiation', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'a'
    }, remath);
    expect(cell.symbol).toBe('a');
  });

  it('sets error when symbol includes a number for the first character', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: '9'
    }, remath);
    expect(cell.symbol).toBe('9');
    expect(cell.hasError).toBe(true);
    expect(cell.error.message).toBe('Symbol: `9` is not a valid symbol. Symbols can only include alphanumeric characters including the underscore.');
  });

  it('no error when symbol includes a non-number first character', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'a_9'
    }, remath);
    expect(cell.symbol).toBe('a_9');
    expect(cell.hasError).toBe(false);
  });

  it('sets error when symbol is blank', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: ''
    }, remath);
    expect(cell.hasError).toBe(true);
    expect(cell.error.message).toBe('Symbol: `` is not a valid symbol. Symbols can only include alphanumeric characters including the underscore.');
  });

  it('sets error when symbol has space', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'with space'
    }, remath);
    expect(cell.hasError).toBe(true);
    expect(cell.error.message).toBe('Symbol: `with space` is not a valid symbol. Symbols can only include alphanumeric characters including the underscore.');
  });

  it('clears error when valid symbol is set', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: '9'
    }, remath);
    expect(cell.hasError).toBe(true);
    cell.setSymbol('a');
    expect(cell.hasError).toBe(false);
    expect(cell.error.type).toBeNull();
    expect(cell.error.message).toBeNull();
  });

  it('defaults to unlocked', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'a'
    }, remath);
    expect(cell.locked).toBe(false);
  });

  it('can instantiate locked', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'a',
      locked: true
    }, remath);
    expect(cell.locked).toBe(true);
  });

  it('can lock', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'a'
    }, remath);
    cell.lock();
    expect(cell.locked).toBe(true);
  });

  it('can unlock', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'a',
      locked: true
    }, remath);
    expect(cell.locked).toBe(true);
    cell.unlock();
    expect(cell.locked).toBe(false);
  });

  it('can set value', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'a',
      value: '= 10'
    }, remath);
    cell.setValue('= 11');
    expect(cell.value).toBe(11);
  });

  it('cannot set value when locked', () => {
    const remath = new Remath();
    const cell = new Cell({
      symbol: 'a',
      value: '= 10',
      locked: true
    }, remath);
    cell.setValue('= 11');
    expect(cell.value).toBe(10);
  });
});
