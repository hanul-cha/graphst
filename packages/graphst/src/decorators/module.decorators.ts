import { MetadataStorage } from '../metadata/MetadataStorage';
import { ModuleMetadata } from '../metadata/interfaces';

export function Module(metadata: ModuleMetadata): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    storage.modules.set(target, metadata);
  };
}
