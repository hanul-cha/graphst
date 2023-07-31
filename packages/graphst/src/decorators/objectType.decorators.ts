import { MetadataStorage } from '../metadata/metadataStorag';

export function ObjectType(name?: string): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    storage.setProvider(target, { target: target as any });
    storage.setObjectType(target, {
      name: name || target.name,
      target,
    });
  };
}
