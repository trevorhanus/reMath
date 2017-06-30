import {Lockable} from '../src/Lockable';
import {autorun} from 'mobx';
import * as sinon from 'sinon';

describe('Lockable', () => {
   it('instantiates with no state', () => {
      const lock = new Lockable();
      expect(lock.locked).toBe(false);
   });

   it('instantiates with state locked', () => {
      const lock = new Lockable({locked: true});
      expect(lock.locked).toBe(true);
   });

   it('instantiates with state unlocked', () => {
      const lock = new Lockable({locked: false});
      expect(lock.locked).toBe(false);
   });

   it('can lock, unlock, and toggle', () => {
      const lock = new Lockable({locked: false});
      expect(lock.locked).toBe(false);

      lock.lock();
      expect(lock.locked).toBe(true);

      lock.unlock();
      expect(lock.locked).toBe(false);

      lock.unlock();
      expect(lock.locked).toBe(false);

      lock.toggleLocked();
      expect(lock.locked).toBe(true);
   });

   it('is observable', () => {
      const lock = new Lockable({locked: false});
      let v;
      const renderSpy = sinon.spy(() => {
          v = `${lock.locked}`;
      });
      autorun(renderSpy);
      expect(v).toBe('false');
      lock.lock();
      expect(v).toBe('true');
      lock.unlock();
      expect(v).toBe('false');
   });
});
