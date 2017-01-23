import {Graph} from '../src/Graph';
import * as sinon from 'sinon';
import {BaseCell} from '../src/BaseCell';
import {Formula} from '../src/Formula';

describe('Formula', () => {
  it('can instantiate', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    expect(formula).toBeTruthy();
  });

  it('can set and get the formula to a constant', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    formula.setFormula('= 10');
    expect(formula.formula).toBe('= 10');
  });

  it('can set and get the formula with boolean', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    formula.setFormula('= true');
    expect(formula.formula).toBe('= true');
  });

  it('can get the value for a constant', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    formula.setFormula('= 10');
    expect(formula.value).toBe(10);
  });

  it('value for a formula', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    formula.setFormula('= 10');
    expect(formula.value).toBe(10);
  });

  it('calls invalid formula', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    formula.setFormula('= %');
    expect(cell.displayValue).toBe('#FORM!');
  });

  it('returns invalid formula', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    formula.setFormula('= %');
    expect(formula.formula).toBe('= %');
  });

  it('resets formula after supplying valid formula', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    formula.setFormula('= %');
    expect(formula.formula).toBe('= %');
    formula.setFormula('= a + b');
    expect(formula.formula).toBe('= a + b');
  });

  it('knows it has dependencies', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    formula.setFormula('= a + b');
    expect(formula.hasDependencies).toBe(true);
  });

  it('no dependencies', () => {
    const graph = new Graph();
    const cell = new BaseCell({
      symbol: 'a'
    }, graph);
    const formula = new Formula(cell, graph);
    formula.setFormula('= 10');
    expect(formula.hasDependencies).toBe(false);
  });
});
