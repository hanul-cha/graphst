import { MetadataStorage } from '../metadata/MetadataStorage';

export function ObjectType(name?: string): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    // Procedure for auto-resolving
    storage.setProvider(target, { target: target as any });
    storage.setObjectType(name || target.name, target);
  };
}
