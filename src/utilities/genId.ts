import {v4} from 'uuid';

const replaceDashRegex = /-/g;

export function genId(): string {
  const uuid = v4();
  const remathId = 'id' + uuid.replace(replaceDashRegex, '');
  return remathId;
}
