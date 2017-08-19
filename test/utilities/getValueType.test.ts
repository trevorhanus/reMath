import {expect} from 'chai';
import {getValueType} from '../../src/utilities/regex';

describe('Get Value Type', () => {

    it('value is formula', () => {
        const value = '= asdfasdf   ';
        expect(getValueType(value)).to.equal('formula');
    });

    it('value is formula with extra spaces', () => {
        const value = '          = asdfasdf   ';
        expect(getValueType(value)).to.equal('formula');
    });

    it('value is text', () => {
        const value = 'asdfasdf';
        expect(getValueType(value)).to.equal('text');
    });
});
