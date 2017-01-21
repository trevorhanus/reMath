import {cleanFormula} from '../../src/utils/regex';

describe('Clean Formula', () => {

  it('lots of white space at start', () => {
    const value = '                      = a + b';
    expect(cleanFormula(value)).toBe('a + b');
  });

  it('lots of white space after equals', () => {
    const value = '=                 a + b';
    expect(cleanFormula(value)).toBe('a + b');
  });

  it('lots of white space at end', () => {
    const value = '=a + b                           ';
    expect(cleanFormula(value)).toBe('a + b');
  });

  it('everything at once', () => {
    const value = '           =                 a + b                           ';
    expect(cleanFormula(value)).toBe('a + b');
  });
});
