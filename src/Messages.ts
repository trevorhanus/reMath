import {v4} from 'uuid';
import {observable, ObservableMap, computed} from 'mobx';

export class Messages {
  @observable _messages: ObservableMap<Message>;

  constructor() {
    this._messages = observable.map<Message>();
  }

  @computed
  get list(): Message[] {
    return this._messages.values();
  }

  add(options: Options) {
    const message: Message = {
      id: v4(),
      type: options.type,
      content: options.content
    };
    this._messages.set(message.id, message);
  }

  remove(id: string) {
    this._messages.delete(id);
  }
}

export interface Message {
  id: string;
  type: Type;
  content: string;
}

export enum Type {
  ERROR,
  WARNING,
  INFO
}

export interface Options {
  type: Type,
  content: string
}
