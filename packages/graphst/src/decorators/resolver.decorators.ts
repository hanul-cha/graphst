import { ConstructType } from '../interfaces/type';
import { MetadataStorage } from '../metadata/metadataStorage';

// TODO: Resolver 데코레이터를 통해 자동으로 수집된 Resolver를 모아놓는다.
export function Resolver(resolverType: () => ConstructType): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    // Procedure for auto-resolving
    storage.setProvider(target, { target: target as any });
  };
}
