import { GraphQLSchema } from 'graphql';
import { Inject } from '../decorators/inject.decorators';
import { GraphqlTypeFactory } from './graphqlTypeFactory';

export class SchemaFactory {
  @Inject(() => GraphqlTypeFactory)
  readonly graphqlTypeFactory!: GraphqlTypeFactory;

  generate(): GraphQLSchema {
    return new GraphQLSchema({
      // mutation: this.mutationTypeFactory.create(resolvers, options),
      // query: this.queryTypeFactory.create(resolvers, options),
      types: this.graphqlTypeFactory.create(),
      // directives: [...specifiedDirectives, ...(options.directives ?? [])],
    });
  }
}
