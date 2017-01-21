const isFormulaRegex = /^[\s]*=[\s]*/g;
const cleanFormulaRegex = /^[\s=]*|[\s]*$/g;

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
