"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mobx_1 = require("mobx");
var errors = require("./errors/CellErrors");
var regex_1 = require("./utils/regex");
var id_1 = require("./utils/id");
var Formula_1 = require("./Formula");
var Symbol_1 = require("./Symbol");
var BaseCell = (function () {
    function BaseCell(options, graph) {
        this._id = id_1.genId();
        this._graph = graph;
        this._errors = new errors.CellErrors();
        this._symbol = new Symbol_1.Symbol(options.symbol, this);
        this._formula = new Formula_1.Formula(this, graph);
        this.setValue(options.value);
        this._locked = options.locked !== undefined ? options.locked : false;
    }
    Object.defineProperty(BaseCell.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCell.prototype, "symbol", {
        get: function () {
            return this._symbol.symbol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCell.prototype, "formula", {
        get: function () {
            return this._formula.formula;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCell.prototype, "hasDependencies", {
        get: function () {
            return this._formula.hasDependencies;
        },
        enumerable: true,
        configurable: true
    });
    BaseCell.prototype.dependsOn = function (symbolOrId) {
        return this._formula.dependsOn(symbolOrId);
    };
    Object.defineProperty(BaseCell.prototype, "hasError", {
        get: function () {
            return this._errors.hasError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCell.prototype, "errorMessage", {
        get: function () {
            return this._errors.message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCell.prototype, "errors", {
        get: function () {
            return this._errors.errors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCell.prototype, "locked", {
        get: function () {
            return this._locked;
        },
        enumerable: true,
        configurable: true
    });
    BaseCell.prototype.lock = function () {
        this._locked = true;
    };
    BaseCell.prototype.unlock = function () {
        this._locked = false;
    };
    BaseCell.prototype.updateSymbol = function (newSymbol) {
        if (this.locked) {
            return;
        }
        this._symbol.updateSymbol(newSymbol);
    };
    BaseCell.prototype.setValue = function (value) {
        if (this.locked) {
            return;
        }
        value = value === undefined ? '' : value;
        var valueType = regex_1.getValueType(value);
        if (valueType === 'formula') {
            this._textValue = null;
            this._formula.setFormula(value);
        }
        else if (valueType === 'text') {
            this._textValue = value;
        }
        else {
            this._errors.unexpectedValue(value);
        }
    };
    BaseCell.prototype.setFormula = function (formula) {
        this._formula.setFormula(formula);
    };
    Object.defineProperty(BaseCell.prototype, "value", {
        get: function () {
            if (this._textValue !== null) {
                return this.textValue;
            }
            else {
                return this._formula.value;
            }
        },
        enumerable: true,
        configurable: true
    });
    BaseCell.prototype.traverseDependecies = function (callback) {
        this._formula.traverseDependencies(callback);
    };
    Object.defineProperty(BaseCell.prototype, "textValue", {
        get: function () {
            if (this.hasError) {
                return this._errors.message;
            }
            else {
                return this._textValue;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCell.prototype, "displayValue", {
        get: function () {
            if (this.hasError) {
                return this._errors.displayValue;
            }
            else {
                return this.value.toString();
            }
        },
        enumerable: true,
        configurable: true
    });
    return BaseCell;
}());
__decorate([
    mobx_1.observable
], BaseCell.prototype, "_textValue", void 0);
__decorate([
    mobx_1.observable
], BaseCell.prototype, "_formula", void 0);
__decorate([
    mobx_1.observable
], BaseCell.prototype, "_locked", void 0);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "id", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "symbol", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "formula", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "hasDependencies", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "hasError", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "errorMessage", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "errors", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "locked", null);
__decorate([
    mobx_1.action
], BaseCell.prototype, "lock", null);
__decorate([
    mobx_1.action
], BaseCell.prototype, "unlock", null);
__decorate([
    mobx_1.action
], BaseCell.prototype, "updateSymbol", null);
__decorate([
    mobx_1.action
], BaseCell.prototype, "setValue", null);
__decorate([
    mobx_1.action
], BaseCell.prototype, "setFormula", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "value", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "textValue", null);
__decorate([
    mobx_1.computed
], BaseCell.prototype, "displayValue", null);
exports.BaseCell = BaseCell;
//# sourceMappingURL=BaseCell.js.map