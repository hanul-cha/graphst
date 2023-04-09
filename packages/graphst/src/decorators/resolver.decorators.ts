import { MetadataStorage } from '../metadata/metadataStorage';

export function Resolver(metadata: any): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    storage.providers.set(target, { target: target as any });
  };
}
