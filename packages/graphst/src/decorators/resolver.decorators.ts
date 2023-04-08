import { MetadataStorage } from '../metadata/MetadataStorage';

export function Resolver(metadata: any): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    storage.resolvers.set(target, {
      target,
      middleware: metadata.middleware,
    });
  };
}
