import {Node} from '../src/Node';
import {Remath} from '../src/Remath';

describe('Node', () => {
   it('instantiates with no id', () => {
      const node = new Node({} as Remath, {});
      expect(node.id).toMatch(/id\w{32}/);
      expect(node.providers.length).toBe(0);
      expect(node.dependents.length).toBe(0);
   });

   it('instantiates with id', () => {
      const node = new Node({} as Remath, {id: '1'});
      expect(node.id).toMatch('1');
      expect(node.providers.length).toBe(0);
      expect(node.dependents.length).toBe(0);
   });

   it('can add a provider', () => {
      const node1 = new Node({} as Remath, {});
      const node2 = new Node({} as Remath, {});
      node1.addProvider(node2);
      expect(node1.providers).toEqual([node2]);
   });

   it('can add a dependent', () => {
      const node1 = new Node({} as Remath, {});
      const node2 = new Node({} as Remath, {});
      node1.addDependent(node2);
      expect(node1.dependents).toEqual([node2]);
   });

   it('recursively find dependents', () => {
      const node1 = new Node({} as Remath, {});
      const node2 = new Node({} as Remath, {});
      const node3 = new Node({} as Remath, {});
      node1.addDependent(node2);
      node2.addDependent(node3);
      expect(node1.dependents).toEqual([node2, node3]);
   });

   it('recursively find providers', () => {
      const node1 = new Node({} as Remath, {});
      const node2 = new Node({} as Remath, {});
      const node3 = new Node({} as Remath, {});
      node1.addProvider(node2);
      node2.addProvider(node3);
      expect(node1.providers).toEqual([node2, node3]);
   });

   it('can add dependency', () => {
      const a = new Node({} as Remath);
      const b = new Node({} as Remath);
      b.addDependency(a);
      expect(b.dependsOn(a)).toBe(true);
      expect(a.providesFor(b)).toBe(true);
   });

   it('deep dependency', () => {
      const a = new Node({} as Remath);
      const b = new Node({} as Remath);
      const c = new Node({} as Remath);
      b.addDependency(a);
      c.addDependency(b);
      expect(b.dependsOn(a)).toBe(true);
      expect(a.providesFor(b)).toBe(true);
      expect(c.dependsOn(a)).toBe(true);
   });

   it('recursively find provides for', () => {
      const node1 = new Node({} as Remath, {});
      const node2 = new Node({} as Remath, {});
      const node3 = new Node({} as Remath, {});
      node3.addDependency(node2);
      node2.addDependency(node1);
      expect(node1.providesFor(node3)).toBe(true);
      expect(node2.providesFor(node3)).toBe(true);
      expect(node3.dependsOn(node1)).toBe(true);
   });

   it('circular reference', () => {
      const a = new Node({} as Remath);
      const b = new Node({} as Remath);
      const c = new Node({} as Remath);
      b.addDependency(a);
      c.addDependency(b);
      expect(() => {
         a.addDependency(c);
      }).toThrow();
   });

   it('can remove a dependency', () => {
      const node2 = new Node({} as Remath, {});
      const node3 = new Node({} as Remath, {});
      node3.addDependency(node2);
      expect(node3.dependsOn(node2)).toBe(true);
      expect(node2.providesFor(node3)).toBe(true);
      node3.removeDependency(node2);
      expect(node3.dependsOn(node2)).toBe(false);
      expect(node2.providesFor(node3)).toBe(false);
   });
});
