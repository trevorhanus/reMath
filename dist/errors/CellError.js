"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mobx_1 = require("mobx");
var CellError = (function () {
    function CellError(options) {
        this._type = options.type;
        this._message = options.message;
    }
    Object.defineProperty(CellError.prototype, "displayValue", {
        get: function () {
            var index = this._type;
            return ErrorTypeToDisplayValueMap[index];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellError.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellError.prototype, "type", {
        get: function () {
            return this._type.toString();
        },
        enumerable: true,
        configurable: true
    });
    return CellError;
}());
__decorate([
    mobx_1.observable
], CellError.prototype, "_type", void 0);
__decorate([
    mobx_1.observable
], CellError.prototype, "_message", void 0);
__decorate([
    mobx_1.computed
], CellError.prototype, "displayValue", null);
__decorate([
    mobx_1.computed
], CellError.prototype, "message", null);
__decorate([
    mobx_1.computed
], CellError.prototype, "type", null);
exports.CellError = CellError;
var Type;
(function (Type) {
    Type[Type["INVALID_SYMBOL"] = 0] = "INVALID_SYMBOL";
    Type[Type["REF_NOT_FOUND"] = 1] = "REF_NOT_FOUND";
    Type[Type["REF_CIRCULAR"] = 2] = "REF_CIRCULAR";
    Type[Type["INVALID_FORMULA"] = 3] = "INVALID_FORMULA";
    Type[Type["INVALID_VALUE"] = 4] = "INVALID_VALUE";
})(Type = exports.Type || (exports.Type = {}));
var ErrorTypeToDisplayValueMap = {
    '0': '#SYM!',
    '1': '#REF?',
    '2': '#CIRC!',
    '3': '#FORM!',
    '4': '#VAL!'
};
//# sourceMappingURL=CellError.js.map