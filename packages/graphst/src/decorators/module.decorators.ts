import { ModuleMetadataStorage } from '../metadata/MetadataStorage';
import { ModuleMetadata } from '../module/types';

export function Module(metadata: ModuleMetadata): ClassDecorator {
  const storage = ModuleMetadataStorage.getStorage();
  return (target: Function) => {
    storage.modules.set(target, metadata);
  };
}
