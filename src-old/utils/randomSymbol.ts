import * as randomstring from 'randomstring';

export default function randomSymbol() {
  const options = {
    length: 8,
    charset: 'alphabetic',
    capitalization: 'lowercase'
  };
  return randomstring(options);
}
