"use strict";
function getValueType(value) {
    var isFormulaRegex = /^[\s]*=[\s]*/g;
    if (value.match(isFormulaRegex)) {
        return 'formula';
    }
    else {
        return 'text';
    }
}
exports.getValueType = getValueType;
function cleanFormula(dirtyFormula) {
    var cleanFormulaRegex = /^[\s=]*|[\s]*$/g;
    return dirtyFormula.replace(cleanFormulaRegex, '');
}
exports.cleanFormula = cleanFormula;
function isValidSymbol(symbol) {
    var validSymbol = /^(\D)(\w)*$/;
    return validSymbol.test(symbol);
}
exports.isValidSymbol = isValidSymbol;
function matchesIdFormat(id) {
    var isId = /^id\w{32}/g;
    return isId.test(id);
}
exports.matchesIdFormat = matchesIdFormat;
//# sourceMappingURL=regex.js.map