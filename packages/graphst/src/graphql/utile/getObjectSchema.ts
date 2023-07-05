import { Container } from '../../container';
import { GraphqlFieldFactory } from '../factory/graphqlFieldFactory';

export function getObjectSchema(target: Function) {
  const graphqlFieldFactory = Container.getProvider(GraphqlFieldFactory);

  if (!graphqlFieldFactory) {
    throw new Error('container is not registered');
  }

  return graphqlFieldFactory.getEntityGraphqlType(target);
}
