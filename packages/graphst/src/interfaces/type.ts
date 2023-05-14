import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
} from 'graphql';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type ConstructType<T = any> = new (...args: any[]) => T;

export type GqlTypeReference<T = any> =
  | Type<T>
  | GraphQLScalarType
  | Function
  | object
  | symbol;
export type ReturnTypeFuncValue = GqlTypeReference | [GqlTypeReference];

export type GraphQLEntityType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType;
