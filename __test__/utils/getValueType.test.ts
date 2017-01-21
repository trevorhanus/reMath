import {getValueType} from '../../src/utils/regex';

describe('Get Value Type', () => {

  it('value is formula', () => {
    const value = '= asdfasdf   ';
    expect(getValueType(value)).toBe('formula');
  });

  it('value is formula with extra spaces', () => {
    const value = '          = asdfasdf   ';
    expect(getValueType(value)).toBe('formula');
  });

  it('value is text', () => {
    const value = 'asdfasdf';
    expect(getValueType(value)).toBe('text');
  });
});
