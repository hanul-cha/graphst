import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
} from 'graphql';

export interface ResolverMetadata {
  name: string;
  type: string;
  methodName: string;
  callback?: Function | Record<string, any>;
}

export interface ResolverValue {
  [key: string]: Function | Record<string, any>;
}

export type GraphQLEntityType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType;

export enum GraphqlMethod {
  QUERY = 'Query',
  MUTATION = 'Mutation',
  SUBSCRIPTION = 'Subscription',
}
