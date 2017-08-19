import {expect} from 'chai';
import * as sinon from 'sinon';
import {hasher} from '../src/utilities/Hasher';
import {Symbol} from '../src/Symbol';
import {ErrorType} from "../src/IError";

describe('Symbol', () => {
    let graph: any;

    before(() => {
        graph = {
            symbolExists: sinon.stub()
        };
    });

    afterEach(() => {
        (graph as any).symbolExists.resetBehavior();
    });

    it('throws when symbol is missing', () => {
        expect(() => {
            new Symbol(graph, {} as any);
        }).to.throw();
    });

    it('can instantiate', () => {
        const derp = new Symbol(graph, {symbol: 'derp'});
        expect(derp.symbol).to.equal('derp');
    });

    it('sets key-value pair in hasher', () => {
        const derp = new Symbol(graph, {symbol: 'derp'});
        expect(hasher.getKey(derp.id)).to.equal('derp');
    });

    it('symbol that contains number', () => {
        const derp = new Symbol(graph, {symbol: 'a_9'});
        expect(derp.symbol).to.equal('a_9');
        expect(hasher.getKey(derp.id)).to.equal('a_9');
        expect(derp.errors.length).to.equal(0);
    });

    it('sets error when symbol is blank', () => {
        const cell = new Symbol(graph, {symbol: ''});
        expect(cell.errors.length).to.equal(1);
    });

    it('sets error when symbol has space', () => {
        const cell = new Symbol(graph, {symbol: 'with space'});
        expect(cell.errors.length).to.equal(1);
    });

    it('can update symbol', () => {
        graph.symbolExists.returns(false);
        const derp = new Symbol(graph, {symbol: 'derp'});
        derp.updateSymbol('foo');
        expect(derp.symbol).to.equal('foo');
    });

    it('sets error when symbol exists', () => {
        graph.symbolExists.returns(true);
        const derp = new Symbol(graph, {symbol: 'derp'});
        derp.updateSymbol('foo');
        expect(derp.symbol).to.equal('foo');
        expect(derp.errors[0].type).to.equal(ErrorType.InvalidSymbol);
    });

    it('sets error when symbol is invalid', () => {
        graph.symbolExists.returns(false);
        const derp = new Symbol(graph, {symbol: 'derp'});
        derp.updateSymbol('1foo');
        expect(derp.errors[0].type).to.equal(ErrorType.InvalidSymbol)
        expect(derp.symbol).to.equal('1foo');
    });

    it('clears errors when symbol is updated', () => {
        graph.symbolExists.returns(false);
        const derp = new Symbol(graph, {symbol: 'derp'});
        derp.updateSymbol('1foo');
        expect(derp.errors[0].type).to.equal(ErrorType.InvalidSymbol);
        derp.updateSymbol('foo');
        expect(derp.errors.length).to.equal(0);
        expect(derp.symbol).to.equal('foo');
    });
});
