import { GraphQLInputType, GraphQLOutputType } from 'graphql';
import { GraphQLEntityType } from '../interfaces/type';
import { MetadataStorage } from '../metadata/MetadataStorage';

export function FieldResolver(options: {
  parent: () => GraphQLEntityType | Function;
  returnType: () => GraphQLOutputType;
  args?: Record<string, () => GraphQLInputType>;
  name?: string;
}): MethodDecorator {
  return <T>(
    _target: object,
    propertyKey: string | symbol,
    _descriptor: TypedPropertyDescriptor<T>
  ) => {
    const storage = MetadataStorage.getStorage();
    storage.setFieldResolver({
      target: options.parent,
      name: options.name || propertyKey,
      returnType: options.returnType,
      args: options.args,
    });
  };
}
