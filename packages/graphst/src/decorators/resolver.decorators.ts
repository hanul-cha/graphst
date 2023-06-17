import { ConstructType } from '../interfaces/type';
import { providerType } from '../metadata/interfaces';
import { MetadataStorage } from '../metadata/metadataStorage';
import { MiddlewareClass } from '../middleware/middleware';

type ResolverOption = {
  key: () => ConstructType;
  middlewares?: MiddlewareClass[];
};

type ResolverOption2 = () => ConstructType;

export function Resolver(option: ResolverOption): ClassDecorator;
export function Resolver(key: ResolverOption2): ClassDecorator;
export function Resolver(
  option: ResolverOption2 | ResolverOption
): ClassDecorator {
  const _key = typeof option === 'function' ? option : option.key;
  const middlewares =
    typeof option === 'function' ? [] : option.middlewares ?? [];

  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    storage.setProvider(target, {
      target: target as any,
      type: providerType.RESOLVER,
      middlewares,
    });
  };
}
