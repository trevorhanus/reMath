import {expect} from 'chai';
import {Remath} from '../src/Remath';
import {autorun} from 'mobx';

describe('Remath', () => {

    it('can instantiate', () => {
        const rm = new Remath();
        expect(rm.cells.length).to.equal(0);
    });

    it('can add a cell', () => {
        const rm = new Remath();
        rm.addCell({symbol: 'a'});
        expect(rm.cells.length).to.equal(1);
    });

    it('can add multiple cells', () => {
        const rm = new Remath();
        rm.addCell({symbol: 'a'});
        rm.addCell({symbol: 'b'});
        rm.addCell({symbol: 'c'});
        expect(rm.cells.length).to.equal(3);
    });

    it('can find cells', () => {
        const rm = new Remath();
        const a = rm.addCell({symbol: 'a'});
        expect(rm.find('a')).to.equal(a);
        expect(rm.find(a.id)).to.equal(a);
    });

    it('catches a simple circular reference', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a',
            formula: '= 10'
        });
        a.setFormula('= a');
        expect(a.errors.length).to.equal(1);
    });

    it('catches a complicated circular reference', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a',
            formula: '= 10'
        });
        const b = graph.addCell({
            symbol: 'b',
            formula: '= a + 10'
        });
        const c = graph.addCell({
            symbol: 'c',
            formula: '= b'
        });
        const d = graph.addCell({
            symbol: 'd',
            formula: '= c'
        });
        a.setFormula('= d');
        expect(a.errors.length).to.equal(1);
    });

    // TODO: need to make sure this test works
    xit('re-renders `b = a + 10` when `a` is added to sheet', () => {
        const graph = new Remath();
        // add b which depends on a, but a does not exist
        const b = graph.addCell({
            symbol: 'derp',
            formula: '= a + 10'
        });

        let view: string;
        autorun(() => {
            view = `b:${b.value}`;
        });
        expect(view).to.equal('b:NaN');

        // add a
        const a = graph.addCell({
            symbol: 'a',
            formula: '= 10'
        });
        expect(view).to.equal('b:20');
    });
});
