import { GraphQLInputType, GraphQLOutputType } from 'graphql';
import { GraphQLEntityType, Type } from '../interfaces/type';

export type SetMetaDataFunction<T> = (target: Function, metaData: T) => void;

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

export type FieldResolverTarget = () => GraphQLEntityType | Function;

export interface FieldResolverTypeMetadata {
  target: FieldResolverTarget;
  name: string | symbol;
  returnType: () => GraphQLOutputType;
  fn: Function;
  args?: {
    [key: string]: () => GraphQLInputType;
  };
}

export interface SetResolverMethod extends FieldResolverTypeMetadata {
  name: 'query' | 'mutation' | 'subscription';
}

export interface MetadataStorable {
  setProvider: SetMetaDataFunction<ResolverMetadata>;
  setInjectProps: SetMetaDataFunction<MetadataInjectProp>;
  // setResolverMethod: SetMetaDataFunction<ResolverMethodMetadata>;
  setObjectType: SetMetaDataFunction<ObjectTypeMetadata>;
  setField: SetMetaDataFunction<FieldTypeMetadata>;
  setFieldResolver: SetMetaDataFunction<FieldResolverTypeMetadata>;

  getProvider: (target: Function) => ProviderMetadata | undefined;
  getInjectProps: (target: Function) => MetadataInjectProp[] | undefined;
  // getResolverMethods: () => ResolverMethodMetadata[];
  getObjectTypeAll: () => ObjectTypeMetadata[];
  getFields: (target: Function) => FieldTypeMetadata[];
  getFieldResolvers: (target: Function) => FieldResolverTypeMetadata[];

  clear: () => void;
}
