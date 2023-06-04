import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { GraphqlMutationFactory } from './graphqlMutationFactory';
import { GraphqlObjectFactory } from './graphqlObjectFactory';
import { GraphqlQueryFactory } from './graphqlQueryFactory';

@Injectable()
export class GraphqlFactory {
  @Inject(() => GraphqlObjectFactory)
  objectFactory!: GraphqlObjectFactory;

  @Inject(() => GraphqlQueryFactory)
  queryFactory!: GraphqlQueryFactory;

  @Inject(() => GraphqlMutationFactory)
  mutationFactory!: GraphqlMutationFactory;

  generate() {
    const graphqlList = [
      this.objectFactory.generate(),
      this.queryFactory.generate(),
      this.mutationFactory.generate(),
    ];

    return {
      schemes: graphqlList.map((item) => item.schemes).flat(),
      resolvers: graphqlList.map((item) => item.resolvers).flat(),
    };
  }
}
