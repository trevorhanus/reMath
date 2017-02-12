"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var uuid_1 = require("uuid");
var mobx_1 = require("mobx");
var Messages = (function () {
    function Messages() {
        this._messages = mobx_1.observable.map();
    }
    Object.defineProperty(Messages.prototype, "list", {
        get: function () {
            return this._messages.values();
        },
        enumerable: true,
        configurable: true
    });
    Messages.prototype.add = function (options) {
        var message = {
            id: uuid_1.v4(),
            type: options.type,
            content: options.content
        };
        this._messages.set(message.id, message);
    };
    Messages.prototype.remove = function (id) {
        this._messages.delete(id);
    };
    return Messages;
}());
__decorate([
    mobx_1.observable
], Messages.prototype, "_messages", void 0);
__decorate([
    mobx_1.computed
], Messages.prototype, "list", null);
exports.Messages = Messages;
var Type;
(function (Type) {
    Type[Type["ERROR"] = 0] = "ERROR";
    Type[Type["WARNING"] = 1] = "WARNING";
    Type[Type["INFO"] = 2] = "INFO";
})(Type = exports.Type || (exports.Type = {}));
//# sourceMappingURL=Messages.js.map