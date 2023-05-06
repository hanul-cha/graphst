import { ConstructType } from '../interfaces/type';
import { MetadataInjectProp } from '../metadata/interfaces';
import { MetadataStorage } from '../metadata/MetadataStorage';

export function Inject(
  prop: () => ConstructType
): (target: any, property: string | symbol) => void {
  return (target: any, property: string | symbol) => {
    const _target = target.constructor;
    const storage = MetadataStorage.getStorage();
    const value: MetadataInjectProp = { target: _target, prop, name: property };
    storage.setInjectProps(_target, value);
  };
}
