import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { GraphQLResolverBuilder } from './graphQLResolverBuilder';
import { GraphQLSchemaBuilder } from './graphQLSchemaBuilder';

@Injectable()
export class GraphQLFactory {
  @Inject(() => GraphQLSchemaBuilder)
  readonly graphQLSchemaBuilder!: GraphQLSchemaBuilder;

  @Inject(() => GraphQLResolverBuilder)
  readonly graphQLResolverBuilder!: GraphQLResolverBuilder;

  generate() {
    this.graphQLSchemaBuilder.generate();
  }
}
