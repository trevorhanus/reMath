import {Remath, Cell} from '../src';

describe('Importing Library', () => {

  const remath = new Remath();

  it('list all cells', () => {
    expect(remath.cells.length).toBe(0);
  });

  it('add cell', () => {
    const a: Cell = remath.addCell({
      symbol: 'a'
    });
  });
});
