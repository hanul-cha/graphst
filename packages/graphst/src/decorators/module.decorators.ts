import { DecoratorKey } from '../interfaces/metadata';
import { Type } from '../interfaces/type';

export interface ModuleMetadata {
  key: DecoratorKey;
  resolvers?: Type<any>[];
  // services?: Provider[];
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, (metadata as any)[property], target);
      }
    }
  };
}
