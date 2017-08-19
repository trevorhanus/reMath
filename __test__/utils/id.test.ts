import * as ids from '../../src/utilities/id';
import {matchesIdFormat} from '../../src/utilities/regex';

describe('utils id', () => {

  it('genererates an id', () => {
    const id = ids.genId();
    expect(matchesIdFormat(id)).toBe(true);
  });
});
