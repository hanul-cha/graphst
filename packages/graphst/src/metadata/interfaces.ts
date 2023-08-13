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
import { Type } from '../types';
import { MiddlewareClass } from '../middleware/middleware';
import { GraphQLEntityType, GraphqlMethod } from '../graphql/types';

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

export interface ParameterMetadata {
  target: Function;
  propertyKey: string | symbol;
  parameterIndex: number;
  targetIndex: number;
}

export type FieldResolverTarget = () => GraphQLEntityType | Function;

export interface FieldResolverMetadata {
  name: string | symbol;
  originalName: string | symbol;
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

export interface ResolverGraphqlTypeMetadata extends FieldResolverMetadata {
  target: GraphqlMethod;
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
    GraphqlMethod
  >;
  setGraphqlEntityType: SetMetaDataFunction<GraphQLObjectType>;
  setGraphqlCustomType: (type: GraphqlCusComType) => void;
  setGlobalMiddlewares: (middlewares: MiddlewareClass[]) => void;
  setCopyGraphqlEntityType: SetMetaDataFunction<GraphQLObjectType>;
  setParameter: (data: ParameterMetadata) => void;

  getProviderAll: () => ProviderMetadata[];
  getInjectProps: (target: Function) => MetadataInjectProp[];
  getInjectPropAll: () => MetadataInjectProp[];
  getObjectType: (target: Function) => ObjectTypeMetadata | undefined;
  getObjectTypeAll: () => ObjectTypeMetadata[];
  getFields: (target: Function) => FieldTypeMetadata[];
  getFieldResolvers: (target: Function) => FieldResolverTypeMetadata[];
  getGraphqlMethod: (target: GraphqlMethod) => ResolverGraphqlTypeMetadata[];
  getGraphqlEntityType: (target: Function) => GraphQLObjectType | undefined;
  getGraphqlCustomTypeAll: () => GraphqlCusComType[];
  getResolverAll: () => ProviderMetadata[];
  getResolverByTarget: (target: Function) => ProviderMetadata | undefined;
  getGlobalMiddlewares: () => MiddlewareClass[];
  getCopyGraphqlEntityType: (target: Function) => GraphQLObjectType | undefined;
  getParameter: (
    target: Function,
    methodName: string | symbol
  ) => (number | undefined)[] | null;

  clear: () => void;
}
