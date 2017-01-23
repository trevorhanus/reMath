import {Graph} from '../src/Graph';
import {autorun} from 'mobx';

describe('Remath messages', () => {

  it('Adds a message when removing a cell that is referenced', () => {
    const cells = new Graph();
    const a = cells.addCell({
      symbol: 'a',
      value: '= 10'
    });
    const b = cells.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    cells.removeCell('a');
    expect(cells.messages.length).toBe(1);
  });

  it('Can remove a message', () => {
    const cells = new Graph();
    const a = cells.addCell({
      symbol: 'a',
      value: '= 10'
    });
    const b = cells.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    cells.removeCell('a');
    cells.removeMessage(cells.messages[0].id);
    expect(cells.messages.length).toBe(0);
  });

  it('Remove non-existant message', () => {
    const cells = new Graph();
    cells.removeMessage('fake_id');
    expect(cells.messages.length).toBe(0);
  });
});
