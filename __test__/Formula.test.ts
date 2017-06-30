import * as sinon from 'sinon';
import {Formula} from "../src/Formula";
import {ErrorType} from "../src/IError";
import {autorun} from "mobx";

describe('Formula', () => {

   let graph: any;
   beforeAll(() => {
      graph = {
         find: sinon.stub(),
         hasCell: sinon.stub(),
         symbolExists: sinon.stub()
      };
   });

   afterEach(() => {
      graph.find.resetBehavior();
      graph.symbolExists.resetBehavior();
   });

   it('can instantiate', () => {
      const foo = new Formula(graph, {symbol: 'foo'});
      expect(foo.formula).toBe('');
      expect(foo.value).toEqual(NaN);
   });

   it('can set and get the formula to a constant', () => {
      const foo = new Formula(graph, {
         symbol: 'foo',
         formula: '10'
      });
      expect(foo.formula).toBe('10');
      expect(foo.value).toBe(10);
      foo.setFormula('20 + 30');
      expect(foo.formula).toBe('20 + 30');
      expect(foo.value).toBe(50);
   });

   it('can use = sign in front of formula', () => {
      const foo = new Formula(graph, {
         symbol: 'foo',
         formula: '   = 10'
      });
      expect(foo.formula).toBe('10');
      expect(foo.value).toBe(10);
   });

   it('invalid formula', () => {
      const foo = new Formula(graph, {
         symbol: 'foo',
         formula: '10'
      });
      foo.setFormula('= %');
      expect(foo.errors[0].type).toBe(ErrorType.InvalidFormula)
   });

   it('returns invalid formula', () => {
      const foo = new Formula(graph, {
         symbol: 'foo',
         formula: '10'
      });
      foo.setFormula('%');
      expect(foo.formula).toBe('%');
   });

   it('resets formula after supplying valid formula', () => {
      const foo = new Formula(graph, {
         symbol: 'foo',
         formula: '10'
      });
      foo.setFormula('  %   ');
      expect(foo.formula).toBe('%');
      foo.setFormula('10');
      expect(foo.formula).toBe('10');
      expect(foo.errors.length).toBe(0);
   });

   it('evaluates', () => {
      graph.symbolExists.returns(false);
      const a = new Formula(graph, {
         symbol: 'a',
         formula: '10'
      });
      graph.find.returns(a);
      graph.hasCell.returns(true);
      const b = new Formula(graph, {
         symbol: 'b',
         formula: 'a + 10'
      });
      expect(b.value).toBe(20);
   });

   it('updates when dependent value changes', () => {
      graph.symbolExists.returns(false);
      const a = new Formula(graph, {
         symbol: 'a',
         formula: '10'
      });
      graph.find.returns(a);
      const b = new Formula(graph, {
         symbol: 'b',
         formula: 'a + 10'
      });
      let v: string;
      const viewSpy = sinon.spy(() => {
         v = `a:${a.value},b:${b.value}`;
      });
      autorun(viewSpy);

      expect(v).toBe('a:10,b:20');
      a.setFormula('20');
      expect(v).toBe('a:20,b:30');
   });

   it('Can add `b = a + 10` when `a` does not exist', () => {
      graph.find.returns(null);
      const b = new Formula(graph, {
         symbol: 'b',
         formula: 'a + 10'
      });
      expect(b.value).toEqual(NaN);
      expect(b.errors.length).toBe(1);
   });
});
