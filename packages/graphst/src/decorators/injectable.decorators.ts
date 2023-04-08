import { MetadataStorage } from '../metadata/MetadataStorage';
import { ModuleMetadata } from '../metadata/interfaces';

export function Injectable(): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    storage.providers.set(target, { target: target as any });
  };
}
