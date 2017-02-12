import { ObservableMap } from 'mobx';
export declare class Messages {
    _messages: ObservableMap<Message>;
    constructor();
    readonly list: Message[];
    add(options: Options): void;
    remove(id: string): void;
}
export interface Message {
    id: string;
    type: Type;
    content: string;
}
export declare enum Type {
    ERROR = 0,
    WARNING = 1,
    INFO = 2,
}
export interface Options {
    type: Type;
    content: string;
}
