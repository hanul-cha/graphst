import { GraphQLOutputType, GraphQLType } from 'graphql';
import { Type } from '../interfaces/type';

export type SetMetaDataFunction<T> = (target: Function, metaData: T) => void;
export type SetResolverMethod = (
  target: string,
  fn: Function,
  option?: any
) => void;

export interface ProviderMetadata {
  target: Type;
}

export interface ResolverMetadata {
  target: Type;
}

export interface MetadataInjectProp {
  target: any;
  prop: () => Type;
  name: string | symbol;
}

export interface ResolverMethodMetadata {
  methods: Function[];
  type: string; // query, mutation, subscription , objectName
}

export interface ObjectTypeMetadata {
  name: string;
  target: Function;
}

export interface FieldTypeMetadata {
  name: string | symbol;
  returnType: () => GraphQLOutputType;
}

// export interface argsMetadata {
//   target: Type;
//   name: string;
//   option: {
//     type: GraphQLType;
//   };
// }

export interface MetadataStorable {
  setProvider: SetMetaDataFunction<ResolverMetadata>;
  setInjectProps: SetMetaDataFunction<MetadataInjectProp>;
  setResolverMethod: SetResolverMethod;
  setObjectType: SetMetaDataFunction<ObjectTypeMetadata>;
  setField: SetMetaDataFunction<FieldTypeMetadata>;
  // setArgs: SetMetaDataFunction<argsMetadata>;

  getProvider: (target: Function) => ProviderMetadata | undefined;
  getInjectProps: (target: Function) => MetadataInjectProp[] | undefined;
  getResolverMethods: () => ResolverMethodMetadata[];
  getObjectTypeAll: () => ObjectTypeMetadata[];
  getFields: (target: Function) => FieldTypeMetadata[];
  // getArgs: (target: Function) => argsMetadata[] | undefined;

  clear: () => void;
}
