import {expect} from 'chai';
import {autorun, runInAction} from 'mobx';
import * as sinon from 'sinon';
import {Remath} from "../../src/Remath";

describe('Reference Not Found', () => {

    it('simple reference does not exist', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a',
            formula: '= 10'
        });
        a.setFormula('= b + 10');
        expect(a.errors.length).to.equal(1);
        expect(a.value).to.be.NaN;
    });

    it('reference is removed', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a',
            formula: '= 10'
        });
        const b = graph.addCell({
            symbol: 'b',
            formula: '= a + 10'
        });
        expect(b.value).to.equal(20);
        expect(b.errors.length).to.equal(0);
        // remove a from sheet
        runInAction(() => {
            graph.removeCell('a');
        });

        expect(b.value).to.be.NaN;
    });

    it('rerenders when reference is removed', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a',
            formula: '= 10'
        });
        const b = graph.addCell({
            symbol: 'b',
            formula: '= a + 10'
        });
        const renderSpy = sinon.spy(() => {
            b.value
        });
        autorun(renderSpy);
        graph.removeCell('a');
        const expectedCallCount = 3;
        // 1) when autorun is executed for the first time
        // 2) when value changes to NaN because `b` can't find the value of `a`
        // TODO: 3) figure out why there is a 3rd call to render?
        expect(renderSpy.callCount).to.equal(expectedCallCount);
    });
});
