import * as errors from '../src/errors/CellErrors';
import * as error from '../src/errors/CellError';

describe('Errors', () => {

  it('sets invalid Formula error', () => {
    const ers = new errors.CellErrors();
    ers.invalidFormula('%', new Error('invalid formula dude'));
    expect(ers.hasError).toBe(true);
  });

  it('clears error when one exists', () => {
    const ers = new errors.CellErrors();
    ers.invalidFormula('%', new Error('invalid formula dude'));
    ers.clear(error.Type.INVALID_FORMULA);
    expect(ers.hasError).toBe(false);
  });

  it('does not clear error of another type', () => {
    const ers = new errors.CellErrors();
    ers.invalidFormula('%', new Error('invalid formula dude'));
    ers.clear(error.Type.INVALID_SYMBOL);
    expect(ers.hasError).toBe(true);
  });

  it('returns errors list', () => {
    const ers = new errors.CellErrors();
    ers.invalidFormula('%', new Error('invalid formula dude'));
    expect(ers.errors.length).toBe(1);
  });

  it('display value is blank when no errors', () => {
    const ers = new errors.CellErrors();
    expect(ers.displayValue).toBe('');
  });

  it('returns display value', () => {
    const ers = new errors.CellErrors();
    ers.invalidFormula('%', new Error('invalid formula dude'));
    expect(ers.displayValue).toBe('#FORM!');
  });
});
