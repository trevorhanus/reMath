import {expect} from 'chai';
import {autorun} from 'mobx';
import * as sinon from 'sinon';
import {Remath} from '../src/Remath';
import {hasher} from '../src/utilities/Hasher';

describe('Remath', () => {

    it('add a cell', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a'
        });
        expect(graph.find('a')).to.equal(a);
    });

    it('find by id', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a'
        });
        expect(graph.find(a.id)).to.equal(a);
    });

    it('find by id with 2 cells', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a'
        });
        const b = graph.addCell({
            symbol: 'b'
        });
        expect(graph.find(a.id)).to.equal(a);
    });

    it('find => null when no symbol', () => {
        const graph = new Remath();
        expect(graph.find('a')).to.be.null;
    });

    it('find => null when no id', () => {
        const graph = new Remath();
        expect(graph.find(hasher.getHash('none'))).to.be.null;
    });

    it('returns a list of cells', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a'
        });
        const b = graph.addCell({
            symbol: 'b'
        });
        expect(graph.cells).to.be.instanceOf(Array);
        expect(graph.cells.length).to.equal(2);
    });

    it('knows when symbol exists', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a'
        });
        expect(graph.symbolExists('a')).to.equal(true);
    });

    it('knows when updated symbol exists', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a'
        });
        a.updateSymbol('b');
        expect(graph.symbolExists('a')).to.equal(false);
        expect(graph.symbolExists('b')).to.equal(true);
    });

    it('Can remove a cell', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a'
        });
        expect(graph.cells.length).to.equal(1);
        graph.removeCell('a');
        expect(graph.cells.length).to.equal(0);
        expect(graph.symbolExists('a')).to.equal(false);
        expect(graph.find(a.id)).to.be.null;
        expect(graph.find('a')).to.be.null;
    });

    it('reacts when a dependent cell is removed', () => {
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
            b.value;
        });
        autorun(renderSpy);
        expect(b.value).to.equal(20);
        graph.removeCell('a');
        expect(renderSpy.callCount).to.equal(3);
        expect(b.hasError).to.equal(true);
        expect(b.value).to.be.NaN;
    });

    // TODO: add the messages functionality to graph
    // xit('Duplicate symbols', () => {
    //     const graph = new Remath();
    //     const messagesSpy = sinon.spy(() => {
    //         graph.messages;
    //     });
    //     autorun(messagesSpy);
    //     const a = graph.addCell({
    //         symbol: 'a'
    //     });
    //     const a2 = graph.addCell({
    //         symbol: 'a'
    //     });
    //     expect(messagesSpy.callCount).to.equal(2);
    //     expect(graph.messages[0].content).to.equal('Remath: symbol `a` already exists');
    // });

    it('can add a removed symbol', () => {
        const graph = new Remath();
        const a = graph.addCell({
            symbol: 'a'
        });
        graph.removeCell('a');
        const a2 = graph.addCell({
            symbol: 'a'
        });
        expect(graph.find('a')).to.equal(a2);
    });
});
