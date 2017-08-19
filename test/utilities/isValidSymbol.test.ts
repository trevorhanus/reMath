import {expect} from 'chai';
import {isValidSymbol} from '../../src/utilities/regex';

describe('Valid Symbol', () => {

    it('symbol with space', () => {
        const symbol = 'asd asdfasdf';
        expect(isValidSymbol(symbol)).to.equal(false);
    });

    it('symbol starts with number', () => {
        const symbol = '9test';
        expect(isValidSymbol(symbol)).to.equal(false);
    });

    it('symbol is ok', () => {
        const symbol = 'test';
        expect(isValidSymbol(symbol)).to.equal(true);
    });

    it('symbol is ok and has number in it', () => {
        const symbol = 'test999';
        expect(isValidSymbol(symbol)).to.equal(true);
    });

    it('symbol has space at end', () => {
        const symbol = 'test   ';
        expect(isValidSymbol(symbol)).to.equal(false);
    });
});
