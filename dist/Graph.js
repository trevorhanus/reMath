"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mobx_1 = require("mobx");
var BaseCell_1 = require("./BaseCell");
var messages = require("./Messages");
var regex_1 = require("./utils/regex");
var Graph = (function () {
    function Graph() {
        this._cells = mobx_1.observable.map();
        this._messages = new messages.Messages();
        this._symbolToIdMap = {};
    }
    Object.defineProperty(Graph.prototype, "cells", {
        get: function () {
            return this._cells.values();
        },
        enumerable: true,
        configurable: true
    });
    Graph.prototype.find = function (symbolOrId) {
        var cell;
        var probablyAnId = regex_1.matchesIdFormat(symbolOrId);
        if (probablyAnId) {
            cell = this._cells.get(symbolOrId);
        }
        if (cell === undefined) {
            var id = this.getId(symbolOrId);
            cell = this._cells.get(id);
        }
        return cell;
    };
    Graph.prototype.symbolExists = function (symbol) {
        var id = this.getId(symbol);
        return this._cells.has(id);
    };
    Graph.prototype.fromJSON = function (calcJSON) {
        var _this = this;
        calcJSON.cells.forEach(function (cellJSON) {
            _this.addCell(cellJSON);
        });
    };
    Graph.prototype.addCell = function (options) {
        var symbol = options.symbol;
        if (this.symbolExists(symbol)) {
            this._messages.add({
                type: messages.Type.ERROR,
                content: "Remath: symbol `" + symbol + "` already exists"
            });
            return;
        }
        var newCell = new BaseCell_1.BaseCell(options, this);
        this.mapSymbol(symbol, newCell.id);
        this._cells.set(newCell.id, newCell);
        return newCell;
    };
    Graph.prototype.removeCell = function (symbol) {
        var cell = this.find(symbol);
        if (!cell) {
            return;
        }
        var id = this.getId(symbol);
        if (this.cellIsReferencedByOthers(id)) {
            this._messages.add({
                type: messages.Type.WARNING,
                content: "Removing cell with symbol `" + symbol + "` whose value is referenced by other cells."
            });
        }
        this._cells.delete(id);
        delete this._symbolToIdMap[symbol];
    };
    Object.defineProperty(Graph.prototype, "messages", {
        get: function () {
            return this._messages.list;
        },
        enumerable: true,
        configurable: true
    });
    Graph.prototype.removeMessage = function (id) {
        this._messages.remove(id);
    };
    Graph.prototype.cellIsReferencedByOthers = function (id) {
        var cells = this._cells.values();
        return cells.some(function (cell) {
            return cell.dependsOn(id);
        });
    };
    Graph.prototype.getId = function (symbol) {
        return this._symbolToIdMap[symbol];
    };
    Graph.prototype.getSymbol = function (id) {
        var cell = this._cells.get(id);
        if (cell) {
            return cell.symbol;
        }
        else {
            return null;
        }
    };
    Graph.prototype.mapSymbol = function (symbol, id) {
        this._symbolToIdMap[symbol] = id;
    };
    Graph.prototype.updateSymbolToIdMap = function (oldSymbol, newSymbol) {
        var id = this.getId(oldSymbol);
        this.mapSymbol(newSymbol, id);
        delete this._symbolToIdMap[oldSymbol];
    };
    return Graph;
}());
__decorate([
    mobx_1.observable
], Graph.prototype, "_cells", void 0);
__decorate([
    mobx_1.computed
], Graph.prototype, "cells", null);
__decorate([
    mobx_1.action
], Graph.prototype, "fromJSON", null);
__decorate([
    mobx_1.action
], Graph.prototype, "addCell", null);
__decorate([
    mobx_1.action
], Graph.prototype, "removeCell", null);
__decorate([
    mobx_1.computed
], Graph.prototype, "messages", null);
__decorate([
    mobx_1.action
], Graph.prototype, "removeMessage", null);
exports.Graph = Graph;
//# sourceMappingURL=Graph.js.map