import {expect} from 'chai';
import * as ids from '../../src/utilities/genId';
import {matchesIdFormat} from '../../src/utilities/regex';

describe('utils id', () => {

    it('genererates an id', () => {
        const id = ids.genId();
        expect(matchesIdFormat(id)).to.equal(true);
    });
});
