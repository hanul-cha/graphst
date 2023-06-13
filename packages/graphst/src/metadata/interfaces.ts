import { GraphQLInputType, GraphQLOutputType } from 'graphql';
import { GraphQLEntityType, Type } from '../interfaces/type';

export type SetMetaDataFunction<T, U = Function> = (
  target: U,
  metaData: T
) => void;

export interface ProviderMetadata {
  target: Type;
}

export interface MetadataInjectProp {
  target: Function;
  prop: () => Type;
  name: string | symbol;
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

export interface FieldResolverMetadata {
  name: string | symbol;
  returnType: () => GraphQLOutputType;
  fn: Function;
  args?: {
    [key: string]: () => GraphQLInputType;
  };
}

export interface FieldResolverTypeMetadata extends FieldResolverMetadata {
  target: FieldResolverTarget;
}

export type ResolverGraphqlTarget = 'Query' | 'Mutation' | 'Subscription';
export interface ResolverGraphqlTypeMetadata extends FieldResolverMetadata {
  target: ResolverGraphqlTarget;
}

export interface MetadataStorable {
  setProvider: SetMetaDataFunction<ProviderMetadata>;
  setInjectProps: SetMetaDataFunction<MetadataInjectProp>;
  setObjectType: SetMetaDataFunction<ObjectTypeMetadata>;
  setField: SetMetaDataFunction<FieldTypeMetadata>;
  setFieldResolver: SetMetaDataFunction<FieldResolverTypeMetadata>;
  setGraphqlMethod: SetMetaDataFunction<
    ResolverGraphqlTypeMetadata,
    ResolverGraphqlTarget
  >;

  getProviderAll: () => ProviderMetadata[];
  getInjectProps: (target: Function) => MetadataInjectProp[];
  getInjectPropAll: () => MetadataInjectProp[];
  getObjectTypeAll: () => ObjectTypeMetadata[];
  getFields: (target: Function) => FieldTypeMetadata[];
  getFieldResolverAll: () => FieldResolverTypeMetadata[];
  getGraphqlMethod: (
    target: ResolverGraphqlTarget
  ) => ResolverGraphqlTypeMetadata[];

  clear: () => void;
}
