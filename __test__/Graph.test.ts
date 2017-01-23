import {autorun} from 'mobx';
import * as sinon from 'sinon';
import {Graph} from '../src/Graph';
import {genId} from '../src/utils/id';

describe('Graph', () => {

  it('add a cell', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    expect(graph.find('a')).toEqual(a);
  });

  it('find by id', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    expect(graph.find(a.id)).toEqual(a);
  });

  it('find by id with 2 cells', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    const b = graph.addCell({
      symbol: 'b'
    });
    expect(graph.find(a.id)).toEqual(a);
  });

  it('find => undefined when no symbol', () => {
    const graph = new Graph();
    expect(graph.find('a')).toBeUndefined();
  });

  it('find => undefined when no id', () => {
    const graph = new Graph();
    expect(graph.find(genId())).toBeUndefined();
  });

  it('returns a list of cells', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    const b = graph.addCell({
      symbol: 'b'
    });
    expect(graph.cells).toBeInstanceOf(Array);
    expect(graph.cells.length).toBe(2);
  });

  it('knows when symbol exists', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    expect(graph.symbolExists('a')).toBe(true);
  });

  it('knows when updated symbol exists', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    a.updateSymbol('b');
    expect(graph.symbolExists('a')).toBe(false);
    expect(graph.symbolExists('b')).toBe(true);
  });

  it('Can remove a cell', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    expect(graph.cells.length).toBe(1);
    graph.removeCell('a');
    expect(graph.cells.length).toBe(0);
    expect(graph.symbolExists('a')).toBe(false);
    expect(graph.find(a.id)).toBeUndefined();
    expect(graph.find('a')).toBeUndefined();
  });

  it('reacts when a dependent cell is removed', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a',
      value: '= 10'
    });
    const b = graph.addCell({
      symbol: 'b',
      value: '= a + 10'
    });
    const renderSpy = sinon.spy(() => {
      b.value;
    });
    autorun(renderSpy);
    expect(b.value).toBe(20);
    graph.removeCell('a');
    expect(renderSpy.callCount).toBe(2);
    expect(b.hasError).toBe(true);
    expect(b.value).toEqual(NaN);
  });

  it('Duplicate symbols', () => {
    const graph = new Graph();
    const messagesSpy = sinon.spy(() => {
      graph.messages;
    });
    autorun(messagesSpy);
    const a = graph.addCell({
      symbol: 'a'
    });
    const a2 = graph.addCell({
      symbol: 'a'
    });
    expect(messagesSpy.callCount).toBe(2);
    expect(graph.messages[0].content).toBe('Remath: symbol `a` already exists');
  });

  it('can add a removed symbol', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    graph.removeCell('a');
    const a2 = graph.addCell({
      symbol: 'a'
    });
    expect(graph.find('a')).toEqual(a2);
  });

  it('can add a cell with no value', () => {
    const graph = new Graph();
    const a = graph.addCell({
      symbol: 'a'
    });
    expect(a.value).toBe('');
    expect(a.hasError).toBe(false);
  });

  it('populates from JSON', () => {
    const pythagorean = require('./fixtures/pythagorean_theorem.json');
    const graph = new Graph();
    graph.fromJSON(pythagorean);
    expect(graph.cells.length).toBe(3);
    const c = graph.find('c');
    expect(c.value).toBe(5);
  });
});
