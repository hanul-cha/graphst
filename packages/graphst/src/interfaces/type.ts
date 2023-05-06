import { GraphQLScalarType } from 'graphql';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type ConstructType = new (...args: any[]) => any;

export type GqlTypeReference<T = any> =
  | Type<T>
  | GraphQLScalarType
  | Function
  | object
  | symbol;
export type ReturnTypeFuncValue = GqlTypeReference | [GqlTypeReference];
export type ReturnTypeFunc<T extends ReturnTypeFuncValue = any> = (
  returns?: void
) => T;
