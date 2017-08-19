import {expect} from 'chai';
import {Lockable} from '../../src/superclasses/Lockable';
import {autorun} from 'mobx';
import * as sinon from 'sinon';

describe('Lockable', () => {
    it('instantiates with no state', () => {
        const lock = new Lockable();
        expect(lock.locked).to.equal(false);
    });

    it('instantiates with state locked', () => {
        const lock = new Lockable({locked: true});
        expect(lock.locked).to.equal(true);
    });

    it('instantiates with state unlocked', () => {
        const lock = new Lockable({locked: false});
        expect(lock.locked).to.equal(false);
    });

    it('can lock, unlock, and toggle', () => {
        const lock = new Lockable({locked: false});
        expect(lock.locked).to.equal(false);

        lock.lock();
        expect(lock.locked).to.equal(true);

        lock.unlock();
        expect(lock.locked).to.equal(false);

        lock.unlock();
        expect(lock.locked).to.equal(false);

        lock.toggleLocked();
        expect(lock.locked).to.equal(true);
    });

    it('is observable', () => {
        const lock = new Lockable({locked: false});
        let v;
        const renderSpy = sinon.spy(() => {
            v = `${lock.locked}`;
        });
        autorun(renderSpy);
        expect(v).to.equal('false');
        lock.lock();
        expect(v).to.equal('true');
        lock.unlock();
        expect(v).to.equal('false');
    });
});
