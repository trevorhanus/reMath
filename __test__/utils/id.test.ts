import * as ids from '../../src/utils/id';
import {matchesIdFormat} from '../../src/utils/regex';

describe('utils id', () => {

  it('genererates an id', () => {
    const id = ids.genId();
    expect(matchesIdFormat(id)).toBe(true);
  });
});
