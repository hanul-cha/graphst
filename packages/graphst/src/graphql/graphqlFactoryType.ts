import { GraphQLNamedType } from 'graphql';

export interface ResolverMetadata {
  name: string;
  type: string;
  methodName: string;
  callback?: Function | Record<string, any>;
}

export interface ResolverValue {
  [key: string]: Function | Record<string, any>;
}

export interface GraphqlGenerateFactory {
  generateSchema: () => {
    schemes: GraphQLNamedType[];
    resolvers: ResolverValue[];
  };
}
