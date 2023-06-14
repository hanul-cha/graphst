import { GraphQLInputType, GraphQLOutputType } from 'graphql';
import { GraphQLEntityType } from '../interfaces/type';
import { MetadataStorage } from '../metadata/MetadataStorage';

export function FieldResolver(options: {
  parent: () => GraphQLEntityType | Function;
  returnType: () => GraphQLOutputType | Function;
  args?: Record<string, () => GraphQLInputType>;
  name?: string;
  description?: string;
}): MethodDecorator {
  return (
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value;

    const storage = MetadataStorage.getStorage();
    storage.setFieldResolver(options.parent, {
      target: options.parent,
      name: options.name || propertyKey,
      fn: originalMethod,
      returnType: options.returnType,
      args: options.args,
      description: options.description,
    });
  };
}
