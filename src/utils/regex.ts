const isFormulaRegex = /^[\s]*=[\s]*/g;
const cleanFormulaRegex = /^[\s=]*|[\s]*$/g;
const validSymbol = /^(\D)(\w)*$/;

export function getValueType(value: string) {
  if (value.match(isFormulaRegex)) {
    return 'formula';
  } else {
    return 'text';
  }
}

export function cleanFormula(dirtyFormula: string) {
  return dirtyFormula.replace(cleanFormulaRegex, '');
}

export function isValidSymbol(symbol: string): boolean {
  return validSymbol.test(symbol);
}
