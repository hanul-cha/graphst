import { ModuleMetadataStorage } from '../metadata/MetadataStorage';

export function Resolver(metadata: any): ClassDecorator {
  const storage = ModuleMetadataStorage.getStorage();
  return (target: Function) => {
    storage.resolvers.set(target, metadata);
  };
}
