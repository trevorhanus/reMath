import {observable, computed, action, ObservableMap} from 'mobx';
import {genId} from '../utilities/genId';
import {Remath} from '../Remath';
import {IError, ErrorType} from '../IError';
import {Lockable, ILockableState, ILockable} from "./Lockable";

export interface INode extends ILockable {
   readonly id: string;
   readonly graph: Remath;
   providers: INode[];
   dependents: INode[];
   dependsOn: (node: INode) => boolean;
   providesFor: (node: INode) => boolean;
   addDependency: (node: INode) => void;
   addDependent: (node: INode) => void;
   addProvider: (node: INode) => void;
   removeDependency: (node: INode) => void;
   clearDependencies: () => void;
   removeProvider: (node: INode) => void;
   removeDependent: (node: INode) => void;
}

export interface INodeState extends ILockableState {
   id?: string;
}

export class Node extends Lockable implements INode {
   private _id: string;
   private _graph: Remath;
   @observable private _providers: ObservableMap<INode>;
   @observable private _dependents: ObservableMap<INode>;

   constructor(graph: Remath, initialState?: INodeState) {
      super(initialState);
      this._graph = graph;
      this._id = (initialState && initialState.id) || genId();
      this._providers = observable.map<INode>();
      this._dependents = observable.map<INode>();
   }

   get graph(): Remath {
      return this._graph;
   }

   get id(): string {
      return this._id;
   }

   @computed
   get providers(): INode[] {
      return this._providers.values().reduce((list: INode[], node: INode) => {
         return list.concat(node, node.providers);
      }, []);
   }

   @computed
   get dependents(): INode[] {
      return this._dependents.values().reduce((list: INode[], node: INode) => {
         return list.concat(node, node.dependents);
      }, []);
   }

   @action
   addDependency(provider: INode): void {
      this.addProvider(provider);
      provider.addDependent(this);
   }

   @action
   removeDependency(provider: INode): void {
      this.removeProvider(provider);
      provider.removeDependent(this)
   }

   @action
   clearDependencies(): void {
      this.providers.forEach(provider => {
         this.removeDependency(provider);
      });
   }

   @action
   addProvider(provider: INode): void {
      if (this.providesFor(provider)) {
         this.throwCircRefError(`${this.id}'s formula references ${provider.id}, but ${provider.id} depends on ${this.id}`);
      }
      this._providers.set(provider.id, provider);
   }

   @action
   removeProvider(provider: INode): void {
      this._providers.delete(provider.id);
   }

   @action
   addDependent(dependent: INode): void {
      if (this.dependsOn(dependent)) {
         this.throwCircRefError(`${dependent.id}'s formula references ${this.id}, but ${this.id} depends on ${dependent.id}`);
      }
      this._dependents.set(dependent.id, dependent);
   }

   @action
   removeDependent(dependent: INode): void {
      this._dependents.delete(dependent.id);
   }

   providesFor(node: INode): boolean {
      return this.dependents.indexOf(node) > -1;
   }

   dependsOn(node: INode): boolean {
      return this.providers.indexOf(node) > -1;
   }

   @action
   private throwCircRefError(message: string): void {
      const error: IError = {
         type: ErrorType.CircularReference,
         message: message,
         displayValue: '#CIRC!'
      };
      throw error;
   }
}
