import * as error from '../src/errors/CellError';

describe('Cell Error', () => {

  it('sets message and display value', () => {
    const err = new error.CellError({
      type: error.Type.REF_NOT_FOUND,
      message: 'Reference not found'
    });
    expect(err.message).toBe('Reference not found');
    expect(err.displayValue).toBe('#REF?');
  });
});
