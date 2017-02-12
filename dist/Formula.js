"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mobx_1 = require("mobx");
var regex = require("./utils/regex");
var math = require("mathjs");
var Formula = (function () {
    function Formula(parentCell, graph) {
        this._tempInvalidFormula = null;
        this._formula = '';
        this._parentCell = parentCell;
        this._graph = graph;
        this.reactToErrorInValue();
    }
    Formula.prototype.setFormula = function (formula) {
        this._tempInvalidFormula = null;
        var newFormula = regex.cleanFormula(formula);
        var treeRoot = this.parseFormula(newFormula);
        if (treeRoot === null) {
            this._tempInvalidFormula = formula;
            return;
        }
        var circularReferences = this.findCircularReferences(treeRoot);
        if (circularReferences.length > 0) {
            this._parentCell._errors.circularReferences(circularReferences, newFormula);
            this._tempInvalidFormula = formula;
            return;
        }
        this._formula = newFormula;
    };
    Object.defineProperty(Formula.prototype, "formula", {
        get: function () {
            if (this._tempInvalidFormula !== null) {
                return this._tempInvalidFormula;
            }
            else {
                var treeRootWithSymbols = this.exprTree.transform(this.transformIdToSymbol.bind(this));
                return '= ' + treeRootWithSymbols.toString();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Formula.prototype, "value", {
        get: function () {
            if (this._formula === '') {
                return 0;
            }
            try {
                return this.exprTree.eval(this.scope);
            }
            catch (e) {
                return NaN;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Formula.prototype, "exprTree", {
        get: function () {
            var formula = this._formula;
            var treeRoot = math.parse(formula);
            return treeRoot.transform(this.transformSymbolToId.bind(this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Formula.prototype, "scope", {
        get: function () {
            var _this = this;
            var scope = {};
            this.exprTree.filter(function (node) {
                return node.isSymbolNode;
            }).forEach(function (node) {
                var id = node.name;
                var cell = _this._graph.find(id);
                if (cell) {
                    scope[id] = cell.value;
                }
            });
            return scope;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Formula.prototype, "hasDependencies", {
        get: function () {
            return this.exprTree.filter(function (node) {
                return node.isSymbolNode;
            }).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Formula.prototype.traverseDependencies = function (callback) {
        var _this = this;
        this.exprTree.filter(function (node) {
            return node.isSymbolNode;
        }).forEach(function (node) {
            callback(node.name);
            var cell = _this._graph.find(node.name);
            if (cell) {
                cell.traverseDependecies(callback);
            }
        });
    };
    Formula.prototype.dependsOn = function (symbolOrId) {
        if (!this.exprTree) {
            return false;
        }
        var dependsOn = false;
        this.traverseDependencies(function (dependencySymbolOrId) {
            if (symbolOrId === dependencySymbolOrId) {
                dependsOn = true;
            }
        });
        return dependsOn;
    };
    Formula.prototype.parseFormula = function (formula) {
        var node = null;
        try {
            node = math.parse(formula);
        }
        catch (e) {
            this._parentCell._errors.invalidFormula(formula, e);
        }
        return node;
    };
    Formula.prototype.findCircularReferences = function (treeRoot) {
        var _this = this;
        return treeRoot.filter(function (node) {
            return node.isSymbolNode;
        }).reduce(function (cells, node) {
            var cell = _this._graph.find(node.name);
            if (node.name === _this._parentCell.id || node.name === _this._parentCell.symbol) {
                return cells.concat(cell);
            }
            if (cell && cell.dependsOn(_this._parentCell.id)) {
                return cells.concat(cell);
            }
            else {
                return cells;
            }
        }, []);
    };
    Formula.prototype.transformSymbolToId = function (node) {
        if (!node.isSymbolNode) {
            return node;
        }
        var symbol = node.name;
        var newNode = node.clone();
        var id = this._graph.getId(symbol);
        if (id) {
            newNode.name = id;
        }
        else {
        }
        return newNode;
    };
    Formula.prototype.transformIdToSymbol = function (node) {
        if (!node.isSymbolNode) {
            return node;
        }
        var id = node.name;
        var symbol = this._graph.getSymbol(id);
        if (symbol) {
            var newNode = node.clone();
            newNode.name = symbol;
            return newNode;
        }
        else {
            return node;
        }
    };
    Formula.prototype.reactToErrorInValue = function () {
        var _this = this;
        mobx_1.reaction(function () { return _this.value; }, function (value) {
            if (isNaN(value)) {
                _this._parentCell._errors.referenceError();
            }
        }, { fireImmediately: false });
    };
    return Formula;
}());
__decorate([
    mobx_1.observable
], Formula.prototype, "_tempInvalidFormula", void 0);
__decorate([
    mobx_1.observable
], Formula.prototype, "_formula", void 0);
__decorate([
    mobx_1.action
], Formula.prototype, "setFormula", null);
__decorate([
    mobx_1.computed
], Formula.prototype, "formula", null);
__decorate([
    mobx_1.computed
], Formula.prototype, "value", null);
__decorate([
    mobx_1.computed
], Formula.prototype, "exprTree", null);
__decorate([
    mobx_1.computed
], Formula.prototype, "scope", null);
__decorate([
    mobx_1.computed
], Formula.prototype, "hasDependencies", null);
exports.Formula = Formula;
//# sourceMappingURL=Formula.js.map