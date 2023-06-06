import { GraphQLInputType, GraphQLOutputType } from 'graphql';
import { MetadataStorage } from '../metadata/metadataStorage';

export function Mutation(option: {
  returnType: () => GraphQLOutputType;
  args?: Record<string, () => GraphQLInputType>;
  name?: string;
}): MethodDecorator {
  return (
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value;

    const storage = MetadataStorage.getStorage();

    storage.setGraphqlMethod('Mutation', {
      target: 'Mutation',
      fn: originalMethod,
      name: option.name || propertyKey,
      returnType: option.returnType,
      args: option.args,
    });
  };
}
