import { ConstructType } from '../interfaces/type';
import { MetadataStorage } from '../metadata/metadataStorage';

export function Resolver(resolverType: ConstructType): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    // Procedure for auto-resolving
    storage.setProvider(target, { target: target as any });
  };
}
