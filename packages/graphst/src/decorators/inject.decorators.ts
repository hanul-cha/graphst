import { MetadataStorage } from '../metadata/MetadataStorage';

export function Inject(
  prop: any
): (target: any, property: string | symbol) => void {
  return (target: any, property: string | symbol) => {
    const _target = target.constructor;
    const storage = MetadataStorage.getStorage();
    const value = { target: _target, prop, name: property };
    storage.setInjectProps(_target, value);
  };
}
