import {autorun} from 'mobx';
import * as sinon from 'sinon';
import Remath from '../src';

describe('Remath', () => {

  it('Can remove a cell', () => {
    const sheet = new Remath();
    const a = sheet.addCell({
      symbol: 'a'
    });
    expect(sheet.cells.length).toBe(1);
    sheet.removeCell('a');
    expect(sheet.cells.length).toBe(0);
  });

  it('reacts when a dependent cell is removed', () => {
    const sheet = new Remath();
    const a = sheet.addCell({
      symbol: 'a',
    });
    const b = sheet.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    const renderSpy = sinon.spy(() => {
      b.value;
    });
    autorun(renderSpy);
    sheet.removeCell('a');
    expect(renderSpy.callCount).toBe(2);
  });

  it('Duplicate symbols', () => {
    const sheet = new Remath();
    const messagesSpy = sinon.spy(() => {
      sheet.messages;
    });
    autorun(messagesSpy);
    const a = sheet.addCell({
      symbol: 'a'
    });
    const a2 = sheet.addCell({
      symbol: 'a'
    });
    expect(messagesSpy.callCount).toBe(2);
    expect(sheet.messages[0].content).toBe('Remath: symbol `a` already exists');
  });

  it('populates from JSON', () => {
    const pythagorean = require('./fixtures/pythagorean_theorem.json');
    const sheet = new Remath();
    sheet.fromJSON(pythagorean);
    expect(sheet.cells.length).toBe(3);
    const c = sheet.find('c');
    expect(c.value).toBe(5);
  });
});
