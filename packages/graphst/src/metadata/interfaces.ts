import {
  GraphQLInputType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from 'graphql';
import { GraphQLEntityType, Type } from '../interfaces/type';
import { MiddlewareClass } from '../middleware/middleware';

export enum providerType {
  RESOLVER = 'RESOLVER',
}

export type SetMetaDataFunction<T, U = Function> = (
  target: U,
  metaData: T
) => void;

export interface ProviderMetadata {
  target: Type;
  type?: providerType;
  middlewares?: MiddlewareClass[];
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
  description?: string;
}

export type FieldResolverTarget = () => GraphQLEntityType | Function;

export interface FieldResolverMetadata {
  name: string | symbol;
  resolver: Function;
  returnType: () => GraphQLOutputType | Function;
  fn: Function;
  args?: {
    [key: string]: () => GraphQLInputType;
  };
  description?: string;
  middlewares?: MiddlewareClass[];
}

export interface FieldResolverTypeMetadata extends FieldResolverMetadata {
  target: FieldResolverTarget;
}

export type ResolverGraphqlTarget = 'Query' | 'Mutation' | 'Subscription';
export interface ResolverGraphqlTypeMetadata extends FieldResolverMetadata {
  target: ResolverGraphqlTarget;
}

export type GraphqlCusComType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType
  | GraphQLInputObjectType;

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
  setGraphqlEntityType: SetMetaDataFunction<GraphQLObjectType>;
  setGraphqlCustomType: (type: GraphqlCusComType) => void;
  setGlobalMiddlewares: (middlewares: MiddlewareClass[]) => void;

  getProviderAll: () => ProviderMetadata[];
  getInjectProps: (target: Function) => MetadataInjectProp[];
  getInjectPropAll: () => MetadataInjectProp[];
  getObjectTypeAll: () => ObjectTypeMetadata[];
  getFields: (target: Function) => FieldTypeMetadata[];
  getFieldResolverAll: () => FieldResolverTypeMetadata[];
  getGraphqlMethod: (
    target: ResolverGraphqlTarget
  ) => ResolverGraphqlTypeMetadata[];
  getGraphqlEntityType: (target: Function) => GraphQLObjectType | undefined;
  getGraphqlCustomTypeAll: () => GraphqlCusComType[];
  getResolverAll: () => ProviderMetadata[];
  getResolverByTarget: (target: Function) => ProviderMetadata | undefined;
  getGlobalMiddlewares: () => MiddlewareClass[];

  clear: () => void;
}
