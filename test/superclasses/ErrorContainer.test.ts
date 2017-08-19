import {expect} from 'chai';
import {ErrorContainer} from "../../src/superclasses/ErrorContainer";

describe('ErrorContainer', () => {

    describe('constructor', () => {

        it('no params', () => {
            const ec = new ErrorContainer();
            expect(ec).to.be.ok;
            expect(ec.hasError).to.be.false;
        });
    });
});
