import { GraphQLOutputType } from 'graphql';
import { MetadataStorage } from '../metadata/metadataStorage';

type FieldOption = {
  returnType: () => GraphQLOutputType;
  description?: string;
};
export function Field(option: FieldOption): PropertyDecorator;
export function Field(option: () => GraphQLOutputType): PropertyDecorator;
export function Field(
  option: (() => GraphQLOutputType) | FieldOption
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const returnType =
      typeof option === 'function' ? option : option.returnType;

    const description =
      typeof option === 'function' ? undefined : option.description;

    const _target = target.constructor;
    const storage = MetadataStorage.getStorage();
    storage.setField(_target, {
      name: propertyKey,
      returnType,
      description,
    });
  };
}
