"use strict";
var Graph_1 = require("./Graph");
var BaseCell_1 = require("./BaseCell");
exports.Cell = BaseCell_1.BaseCell;
var Remath = (function () {
    function Remath() {
        this._graph = new Graph_1.Graph();
    }
    Remath.prototype.find = function (symbolOrId) {
        return this._graph.find(symbolOrId);
    };
    Object.defineProperty(Remath.prototype, "cells", {
        get: function () {
            return this._graph.cells;
        },
        enumerable: true,
        configurable: true
    });
    Remath.prototype.symbolExists = function (symbol) {
        return this._graph.symbolExists(symbol);
    };
    Remath.prototype.addCell = function (options) {
        return this._graph.addCell(options);
    };
    Remath.prototype.removeCell = function (symbol) {
        this._graph.removeCell(symbol);
    };
    Object.defineProperty(Remath.prototype, "messages", {
        get: function () {
            return this._graph.messages;
        },
        enumerable: true,
        configurable: true
    });
    Remath.prototype.removeMessage = function (id) {
        this._graph.removeMessage(id);
    };
    Remath.prototype.fromJSON = function (calcJSON) {
        var _this = this;
        calcJSON.cells.forEach(function (cellJSON) {
            _this.addCell(cellJSON);
        });
    };
    return Remath;
}());
exports.Remath = Remath;
//# sourceMappingURL=index.js.map