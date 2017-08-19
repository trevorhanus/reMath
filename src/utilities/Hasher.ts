import {genId} from './genId'

export class Hasher {
  private _keyToHashMap: Map<string>;
  private _hashToKeyMap: Map<string>;

  constructor() {
    this._keyToHashMap = new Map<string>();
    this._hashToKeyMap = new Map<string>();
  }

  public getHash(key: string): string {
    const hash = this._keyToHashMap.get(key);
    if (hash !== null) {
      return hash;
    } else {
      const newHash = genId();
      this.set(key, newHash);
      return newHash;
    }
  }

  public getKey(hash: string): string {
    // just return null if we can't find a key
    return this._hashToKeyMap.get(hash);
  }

  public swapKeys(oldKey: string, newKey: string): void {
    const hash = this._keyToHashMap.get(oldKey);
    if (!hash) throw new Error(`attempted to swap keys oldKey: '${oldKey}' with newKey: '${newKey}', but could not find hash for '${oldKey}'`);
    this.remove(oldKey, hash);
    this.set(newKey, hash);
  }

   public set(key: string, hash: string): void {
      this._keyToHashMap.set(key, hash);
      this._hashToKeyMap.set(hash, key);
   }

  private remove(key: string, hash: string): void {
    this._keyToHashMap.delete(key);
    this._hashToKeyMap.delete(hash);
  }
}

class Map<T> {
  private _map: {[key: string]: T};

  constructor() {
    this._map = {};
  }

  public get(key: string): T {
    const value = this._map[key];
    if (value) {
      return value;
    } else {
      return null;
    }
  }

  public set(key: string, value: T): void {
    this._map[key] = value;
  }

  public delete(key: string): void {
    delete this._map[key];
  }
}

const hasher = new Hasher();
export {
   hasher
}
