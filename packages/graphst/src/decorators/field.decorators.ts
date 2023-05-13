import { GraphQLOutputType } from 'graphql';
import { MetadataStorage } from '../metadata/MetadataStorage';

export function Field(returnType: () => GraphQLOutputType): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const _target = target.constructor;
    const storage = MetadataStorage.getStorage();
    storage.setField(_target, {
      name: propertyKey,
      returnType,
    });
  };
}
