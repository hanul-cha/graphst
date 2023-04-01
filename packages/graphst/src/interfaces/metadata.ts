import {
  GraphQLFieldResolver,
  GraphQLOutputType,
  GraphQLFieldConfigArgumentMap,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLScalarType,
  GraphQLEnumType,
} from 'graphql';

export type GraphQLEntityType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType;

export type DecoratorKey = (type: null) => GraphQLEntityType | Function;
