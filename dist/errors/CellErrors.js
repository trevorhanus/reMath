"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mobx_1 = require("mobx");
var error = require("./CellError");
var CellErrors = (function () {
    function CellErrors() {
        this._errors = mobx_1.observable.map();
    }
    Object.defineProperty(CellErrors.prototype, "hasError", {
        get: function () {
            return this._errors.size > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellErrors.prototype, "errors", {
        get: function () {
            return this._errors.values();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellErrors.prototype, "displayValue", {
        get: function () {
            if (this.hasError) {
                return this._errors.values()[0].displayValue;
            }
            else {
                return '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellErrors.prototype, "message", {
        get: function () {
            if (this.hasError) {
                return this._errors.values()[0].message;
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    CellErrors.prototype.referenceError = function () {
        var options = {
            type: error.Type.REF_NOT_FOUND,
            message: "there is an error in one of the references"
        };
        this.set(options);
    };
    CellErrors.prototype.invalidFormula = function (formula, e) {
        var options = {
            type: error.Type.INVALID_FORMULA,
            message: "Formula '" + formula + "' is invalid. " + e.message
        };
        this.set(options);
    };
    CellErrors.prototype.invalidSymbol = function (symbol) {
        var options = {
            type: error.Type.INVALID_SYMBOL,
            message: "[" + symbol + "] is an invalid symbol"
        };
        this.set(options);
    };
    CellErrors.prototype.unexpectedValue = function (value) {
        var options = {
            type: error.Type.INVALID_VALUE,
            message: "Value '" + value + "' causes an error."
        };
        this.set(options);
    };
    CellErrors.prototype.circularReferences = function (cells, formula) {
        var cellSymbols = cells.map(function (cell) {
            return cell.symbol;
        }).join(', ');
        var options = {
            type: error.Type.REF_CIRCULAR,
            message: "'" + formula + "' creates circular references because " + cellSymbols + " references this cell"
        };
        this.set(options);
    };
    CellErrors.prototype.set = function (options) {
        var err = new error.CellError(options);
        this._errors.set(err.type, err);
    };
    CellErrors.prototype.clear = function (type) {
        this._errors.delete(type.toString());
    };
    return CellErrors;
}());
__decorate([
    mobx_1.observable
], CellErrors.prototype, "_errors", void 0);
__decorate([
    mobx_1.computed
], CellErrors.prototype, "hasError", null);
__decorate([
    mobx_1.computed
], CellErrors.prototype, "errors", null);
__decorate([
    mobx_1.computed
], CellErrors.prototype, "displayValue", null);
__decorate([
    mobx_1.computed
], CellErrors.prototype, "message", null);
__decorate([
    mobx_1.action
], CellErrors.prototype, "referenceError", null);
__decorate([
    mobx_1.action
], CellErrors.prototype, "invalidFormula", null);
__decorate([
    mobx_1.action
], CellErrors.prototype, "invalidSymbol", null);
__decorate([
    mobx_1.action
], CellErrors.prototype, "unexpectedValue", null);
__decorate([
    mobx_1.action
], CellErrors.prototype, "circularReferences", null);
__decorate([
    mobx_1.action
], CellErrors.prototype, "set", null);
__decorate([
    mobx_1.action
], CellErrors.prototype, "clear", null);
exports.CellErrors = CellErrors;
//# sourceMappingURL=CellErrors.js.map