import {isValidSymbol} from '../../src/utilities/regex';

describe('Valid Symbol', () => {

  it('symbol with space', () => {
    const symbol = 'asd asdfasdf';
    expect(isValidSymbol(symbol)).toBe(false);
  });

  it('symbol starts with number', () => {
    const symbol = '9test';
    expect(isValidSymbol(symbol)).toBe(false);
  });

  it('symbol is ok', () => {
    const symbol = 'test';
    expect(isValidSymbol(symbol)).toBe(true);
  });

  it('symbol is ok and has number in it', () => {
    const symbol = 'test999';
    expect(isValidSymbol(symbol)).toBe(true);
  });

  it('symbol has space at end', () => {
    const symbol = 'test   ';
    expect(isValidSymbol(symbol)).toBe(false);
  });
});
