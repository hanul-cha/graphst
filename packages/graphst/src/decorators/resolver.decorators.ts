import { ConstructType } from '../interfaces/type';
import { providerType } from '../metadata/interfaces';
import { MetadataStorage } from '../metadata/metadataStorage';

export function Resolver(resolverType: () => ConstructType): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    storage.setProvider(target, {
      target: target as any,
      type: providerType.RESOLVER,
    });
  };
}
