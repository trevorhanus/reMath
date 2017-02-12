"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mobx_1 = require("mobx");
var regex_1 = require("./utils/regex");
var error = require("./errors/CellError");
var Symbol = (function () {
    function Symbol(symbol, parentCell) {
        this._parentCell = parentCell;
        this._tempInvalidSymbol = null;
        this.updateSymbol(symbol);
    }
    Object.defineProperty(Symbol.prototype, "symbol", {
        get: function () {
            if (this._tempInvalidSymbol !== null) {
                return this._tempInvalidSymbol;
            }
            else {
                return this._symbol || '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Symbol.prototype.updateSymbol = function (newSymbol) {
        this._tempInvalidSymbol = null;
        this._parentCell._errors.clear(error.Type.INVALID_SYMBOL);
        newSymbol = newSymbol.trim();
        if (!regex_1.isValidSymbol(newSymbol)) {
            this._parentCell._errors.invalidSymbol(newSymbol);
            this._tempInvalidSymbol = newSymbol;
            return;
        }
        this._parentCell._graph.updateSymbolToIdMap(this._symbol, newSymbol);
        this._symbol = newSymbol;
    };
    return Symbol;
}());
__decorate([
    mobx_1.observable
], Symbol.prototype, "_symbol", void 0);
__decorate([
    mobx_1.observable
], Symbol.prototype, "_tempInvalidSymbol", void 0);
__decorate([
    mobx_1.computed
], Symbol.prototype, "symbol", null);
__decorate([
    mobx_1.action
], Symbol.prototype, "updateSymbol", null);
exports.Symbol = Symbol;
//# sourceMappingURL=Symbol.js.map