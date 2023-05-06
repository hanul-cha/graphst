import { ConstructType, Type } from '../interfaces/type';

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
  prop: () => ConstructType;
  name: string | symbol;
}

export interface ResolverMethodMetadata {
  methods: Function[];
  type: string; // query, mutation, subscription , objectName
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
  // setArgs: SetMetaDataFunction<argsMetadata>;

  getProvider: (target: Function) => ProviderMetadata | undefined;
  getInjectProps: (target: Function) => MetadataInjectProp[] | undefined;
  getResolverMethods: () => ResolverMethodMetadata[];
  // getArgs: (target: Function) => argsMetadata[] | undefined;

  clear: () => void;
}
