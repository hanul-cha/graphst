import { ConstructType } from '../interfaces/type';
import { MetadataInjectProp } from '../metadata/interfaces';
import { MetadataStorage } from '../metadata/metadataStorag';

export function Inject(prop: () => ConstructType): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const _target = target.constructor;
    const storage = MetadataStorage.getStorage();
    const value: MetadataInjectProp = {
      target: _target,
      prop,
      name: propertyKey,
    };
    storage.setInjectProps(_target, value);
  };
}
