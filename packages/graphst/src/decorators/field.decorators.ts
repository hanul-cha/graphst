import { GraphQLOutputType } from 'graphql';
import { MetadataStorage } from '../metadata/MetadataStorage';

// TODO: Function overload로 리턴타입만 받는 경우생성 다른 데코레이터도 마찬가지
export function Field(option: {
  returnType: () => GraphQLOutputType;
  description?: string;
}): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const _target = target.constructor;
    const storage = MetadataStorage.getStorage();
    storage.setField(_target, {
      name: propertyKey,
      returnType: option.returnType,
      description: option.description,
    });
  };
}
