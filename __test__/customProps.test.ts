import Remath from '../src';
import * as sinon from 'sinon';
import {autorun} from 'mobx';

describe('Custom Props', () => {

  it('Add custom props to formula cell', () => {
    const sheet = new Remath();
    const a = sheet.addCell({
      symbol: 'a',
      type: 'formula'
    });
    const renderSpy = sinon.spy(() => {
      a.customProps.get('foo');
    });
    autorun(renderSpy);

    a.customProps.set('foo', 'bar');
    expect(renderSpy.callCount).toBe(2);
    expect(a.customProps.get('foo')).toBe('bar');
  });
});
