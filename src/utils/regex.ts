export function getValueType(value: string) {
  const isFormulaRegex = /^[\s]*=[\s]*/g;
  if (value.match(isFormulaRegex)) {
    return 'formula';
  } else {
    return 'text';
  }
}

export function cleanFormula(dirtyFormula: string) {
  const cleanFormulaRegex = /^[\s=]*|[\s]*$/g;
  return dirtyFormula.replace(cleanFormulaRegex, '');
}

export function isValidSymbol(symbol: string): boolean {
  const validSymbol = /^(\D)(\w)*$/;
  return validSymbol.test(symbol);
}

export function matchesIdFormat(id: string): boolean {
  const isId = /^id\w{32}/g;
  return isId.test(id);
}
